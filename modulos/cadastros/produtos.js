'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const TABLE = process.env.PRODUTOS_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;
const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});


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
        resolve({ statusCode: 200, body: JSON.stringify(data.Items) });
      }
    });
  });
}


module.exports.apagar = async (event, context) => {

  let _parsed;// = value;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${value}: ${err.stack}`);
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
        resolve({ statusCode: 200});
      };
    });
  });
  
}

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
     body: JSON.stringify({error:"Erro ao carregar dados"})
   };
 }

 //Valida produto (campos obrigatorios)
 if(!validate(produto)) {
   console.error("produto invalido");
   return {
     statusCode: 400,
     body: JSON.stringify({error:"Produto invalido!"})
   };
 }

  //Adiciona campos automaticos (Data de criacao e alteracao).
  const timestamp = (new Date()).toISOString();
  produto = {...produto, id: uuid.v1(), submittedAt: timestamp, updatedAt: timestamp}


  // Verifica se ja existe um produto com esse codigo
  var produtoRepetido = await getProdutoByCodigo(produto.codigo);
  if(produtoRepetido.Count > 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({error:"Codigo do produto já existe!"})
    };
  } 

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
        resolve({ statusCode: 200, body: JSON.stringify(produto) });
      }
    });
  });
}


module.exports.alterar = async (event, context) => {

  //Carrega produto enviado via POST
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

 //Valida produto (campos obrigatorios)
 if(!validate(produto) || typeof produto.id !== 'string') {
   console.error("produto invalido");
   return {
     statusCode: 400,
     body: JSON.stringify({error:"Produto invalido!"})
   };
 }

  //Adiciona campos automaticos (Data de alteracao).
  const timestamp = (new Date()).toISOString();
  produto = {...produto, updatedAt: timestamp}


  // Verifica se ja existe um produto com esse codigo (codigo)
  var produtoRepetido = await getProdutoByCodigo(produto.codigo);
  if(produtoRepetido.Count > 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({error:"Codigo do produto já existe em varios produtos!"})
    };
  } else if (produtoRepetido.Count > 0) {
    // Caso tenha um produto com esse codigo verifica se nao é o proprio produto
    if (produtoRepetido.Items[0].id !== produto.id) { 
      return {
        statusCode: 400,
        body: JSON.stringify({error:"Codigo do produto já existe!"})
      };
    }
  }
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
        resolve({ statusCode: 200, body: JSON.stringify(produto) });
      }
    });
  });
}

const validate = (value) => {
  if (typeof value.descricao !== 'string' || typeof value.codigo !== 'string' ) {
    return false;
  }
  return true;
}


const getProdutoByCodigo = (codigo) => {

  var key = { "codigo": codigo };

  const params = {
    TableName: TABLE,
    IndexName: "codigo-index",
    FilterExpression:'codigo = :codigo',
    ExpressionAttributeValues:{ ":codigo" : codigo },
    ScanIndexForward: false
  }

  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, data) => {
      if (error) {
        console.log(`getProdutoByCodigo ERROR=${error.stack}`);
          reject(error);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  });
  
} 