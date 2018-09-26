/**************************************************************
 Autor: Luis Felipe Assumpção Fleury            Data:26/08/2018
 Modulo de Cadastros -                       Tabela de Produtos
 Responsavel pelo cadastro dos produtos 
***************************************************************/


'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const validar = require("../util/validate");
const corsHeaders = require("../util/corsHeaders");

const TABLE = process.env.PRODUTOS_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;
const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});


/************************************************************
 Funcao responsavel por listar todos os produtos
 endpoint: GET /produtos
 visibilidade: pública
*************************************************************/
module.exports.listar = async (event, context) => {
  console.log(event);

  const params = {
    TableName: TABLE
  };
  return await new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, data) => {
      if (error) {
        console.log(`erro ao listar ERROR=${error.stack}`);
          resolve({
            statusCode: 400//,
            //body: JSON.stringify(`Could not create user: ${error.stack}`)
          });
      } else {
        resolve({ statusCode: 200, headers: corsHeaders,  body: JSON.stringify(data.Items) });
      }
    });
  });
}

/************************************************************
 Funcao responsavel por trazer os dados de um produto
 endpoint: GET /produtos/{id}
 visibilidade: pública
*************************************************************/
module.exports.buscar = async (event, context) => {
  console.log(event);
  let idProduto = event.pathParameters.id;
  const params = {
    TableName: TABLE,
    Key: { id: idProduto}
  };
  return await new Promise((resolve, reject) => {
    dynamoDb.get(params, (error, data) => {
      if (error) {
        console.log(`erro ao listar ERROR=${error.stack}`);
          resolve({
            statusCode: 400//,
            //body: JSON.stringify(`Could not create user: ${error.stack}`)
          });
      } else {
        data.Item.token = jwt.sign({id: data.Item.id, preco: data.Item.preco }, JWT_ENCRYPTION_CODE, {
          expiresIn: '24h' //o token irá expirar em 24 hora2
        });
        resolve({ statusCode: 200, headers: corsHeaders,  body: JSON.stringify(data.Item) });
      }
    });
  });
}



/************************************************************
 Funcao responsavel por apagar um produto
 endpoint: DELETE /produtos/{id}
 visibilidade: <admin> e <cadastro>
*************************************************************/
module.exports.apagar = async (event, context) => {
  console.log(event);
  console.log(event.headers.Authorization);
  if (!validar.validate(event.headers.Authorization)){
    console.error(`Erro ao validar token ${value}: ${err.stack}`);
    throw err;
  }
  let _parsed;// = value;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    throw err;
  }  
  const id = _parsed.id;
  console.log(id);
  var key = { "id": id };
  const params = {
    Key: key, 
    TableName: TABLE
  };

  console.log("Attempting a conditional delete...");
  return await new Promise((resolve, reject) => {
    dynamoDb.delete(params, (error, data) => {
      if (error) {
        console.error("Unable to delete item. Error JSON:" + JSON.stringify(error, null, 2));
        resolve({
          statusCode: 400,
          body: JSON.stringify({error:`Não foi possível apagar o produto: ${error.stack}`})
        });
  
      } else {
        resolve({ statusCode: 200, headers: corsHeaders });
      };
    });
  });
  
}

/************************************************************
 Funcao responsavel por incluir um produto
 endpoint: POST /produtos
 visibilidade: <admin> e <cadastro>
*************************************************************/
module.exports.incluir = async (event, context) => {

  //Carrega produto enviado via POST
 let produto = null;  
 let _parsed;
 try {
  produto = JSON.parse(event.body);
 } catch (err) {
   console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
   return {
     statusCode: 400,
     headers: corsHeaders,
     body: JSON.stringify({error:"Erro ao carregar dados"})
   };
 }

 //Valida produto (campos obrigatorios)
 if(!validate(produto)) {
   console.error("produto invalido");
   return {
     statusCode: 400,
     headers: corsHeaders,
     body: JSON.stringify({error:"Produto invalido!"})
   };
 }

  //Adiciona campos automaticos (Data de criacao e alteracao).
  const timestamp = (new Date()).toISOString();
  produto = {...produto, id: uuid.v1(), submittedAt: timestamp, updatedAt: timestamp}

  const params = {
    TableName: TABLE,
    Item: produto
  };
  return await new Promise((resolve, reject) => {
    dynamoDb.put(params, (error, data) => {
      if (error) {
        console.log(`erro ao listar ERROR=${error.stack}`);
          resolve({
            statusCode: 400//,
            headers: corsHeaders
            //body: JSON.stringify(`Could not create user: ${error.stack}`)
          });
      } else {
        resolve({ statusCode: 200, headers: corsHeaders, body: JSON.stringify(produto) });
      }
    });
  });
}


/************************************************************
 Funcao responsavel por alterar um produto
 endpoint: PUT /produtos/{id}
 visibilidade: <admin> e <cadastro>
*************************************************************/
module.exports.alterar = async (event, context) => {

  //Carrega produto enviado via PUT
 let idProduto = event.pathParameters.id; 
 let produto = null;  
 let _parsed;
 try {
  produto = JSON.parse(event.body);
 } catch (err) {
   console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
   return {
     statusCode: 400,
     body: JSON.stringify({error:"Erro ao carregar dados"})
   };
 }

 // Verifica id informado. Nao pode passar um id por parametro e outro no corpo
 if(produto.id === 'string' && produto.id != idProduto) {
  console.error("id incoerente");
  return {
    statusCode: 400,
    body: JSON.stringify({error:"id invalido!"})
  };
 }
 produto.id = idProduto;

 //Valida produto (campos obrigatorios)
 if(!validate(produto) || typeof produto.id !== 'string') {
   console.error("produto invalido");
   return {
     statusCode: 400,
     body: JSON.stringify({error:"Produto invalido!"})
   };
 }


  //Adiciona campos automaticos (Data de alteracao e de criacao).
  const timestamp = (new Date()).toISOString();
  produto = {...produto, updatedAt: timestamp}
  if (produto.submittedAt !== "string")
    produto.submittedAt = timestamp;
  
  const params = {
    TableName: TABLE,
    Item: produto
  };
  return await new Promise((resolve, reject) => {
    dynamoDb.put(params, (error, data) => {
      if (error) {
        console.log(`erro ao listar ERROR=${error.stack}`);
          resolve({
            statusCode: 400//,
            //body: JSON.stringify(`Could not create user: ${error.stack}`)
          });
      } else {
        resolve({ statusCode: 200, headers: getCorsHeaders(), body: JSON.stringify(produto) });
      }
    });
  });
}


/************************************************************
 Funcao interna de validacao do esquema de produto
*************************************************************/
const validate = (value) => {
  if (typeof value.descricao !== 'string' || typeof value.nome !== 'string' ) {
    return false;
  }
  return true;
}

