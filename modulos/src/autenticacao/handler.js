'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const validar = require("../util/validate");
const corsHeaders = require("../util/corsHeaders");


const USUARIOS_TABLE = process.env.USUARIOS_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;
const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});


/*****************************************************************
 Funcao responsavel por deletar os usuarios
 endpoint: DELETE /user/{id}
 visibilidade: <admin>
 deploy: sls deploy function -f autenticacao_deleteUser
******************************************************************/
module.exports.deleteUser = async (event, context) => {


  let id = event.pathParameters.id;
  const authUser = validar.validate(event.headers.Authorization);
  if (!authUser){
    return({ statusCode: 401, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  if (!validar.checkRole(authUser, ['admin'])){
    return({ statusCode: 403, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  
  if(id == authUser.id) {
    console.log("Same user!");
    return({ statusCode: 412, headers: corsHeaders,  body: JSON.stringify({error: `Cannot delete itself ${authUser.id}`})});
  }
  
  console.log(id);
  var key = { "id": id };
  const params = {
    Key: key, 
    TableName: USUARIOS_TABLE
  };

  console.log("Attempting a conditional delete...");
  return await new Promise((resolve, reject) => {
    dynamoDb.delete(params, (error, data) => {
      if (error) {
        console.error("Unable to delete item. Error JSON:" + JSON.stringify(error, null, 2));
        resolve({
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({error:`Could not delete user: ${error.stack}`})
        });
  
      } else {
        resolve({ statusCode: 200});
      };
    });
  });
  
}


/*****************************************************************
 Funcao responsavel por autenticar os usuarios
 endpoint: POST /login
 visibilidade: pública
 deploy: sls deploy function -f autenticacao_login
******************************************************************/
module.exports.authenticate = async (event, context) => {

  let _parsed = null;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 400,
      headers: corsHeaders
      //body: JSON.stringify({error:`Could not parse json: ${err.stack}`})
    };
  }
  const { username, password } = _parsed;

  let finduser = await getUserByLogin(username);
  if (finduser) {
    console.log(finduser);
    let user = await getUserByID(finduser.id);
    console.log(user);
    if(user.password === password) {
        console.log("Gerando Token");
        // remove a senha do payload
        user.password = undefined;
        // criar o token:
        var token = jwt.sign(user, JWT_ENCRYPTION_CODE, {
          expiresIn: '24h' //o token irá expirar em 24 hora2
        });
        return({ statusCode: 200, headers: corsHeaders, body: JSON.stringify(token) })
      }
  }
  return({ statusCode: 404, headers: corsHeaders, body: JSON.stringify({ error: "usuario ou senha invalida!" }) })
};


const parseUser = (value) => {

  // Faz a conversao entre json e objeto
  let _parsed;
  try {
    _parsed = JSON.parse(value);
  } catch (err) {
    console.error(`Could not parse requested JSON ${value}: ${err.stack}`);
    throw err;
  }
  //Valida usuario (campos obrigatorios)
  if(!validateUser(_parsed)) {
    throw new Error("Invalid user!");
  }

  //Adiciona campos automaticos (Data de criacao e alteracao).
  const timestamp = (new Date()).toISOString();
  return {..._parsed, submittedAt: timestamp, updatedAt: timestamp}

}


/*****************************************************************
 Funcao responsavel por listar os usuarios
 endpoint: GET /users
 visibilidade: <admin>
 deploy: sls deploy function -f autenticacao_listarUsuarios
******************************************************************/
module.exports.listarUsuarios = async  (event, context) => {

  const authUser = validar.validate(event.headers.Authorization);
  if (!authUser){
    return({ statusCode: 401, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  if (!validar.checkRole(authUser, ['admin'])){
    return({ statusCode: 403, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  
  const params = {
    TableName: USUARIOS_TABLE,
    IndexName: "userrole-index",
    //FilterExpression:'#userrole = :filterrole',
    //ExpressionAttributeNames: { "#userrole" : "role"},
    //ExpressionAttributeValues:{ ":filterrole" : role },
    //ProjectionExpression: "id, nome",
    //ScanIndexForward: false
  };
  return await new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, data) => {
      if (error) {
        console.log(`erro ao listar ERROR=${error.stack}`);
          resolve({
            statusCode: 400,
            headers: corsHeaders
            //body: JSON.stringify(`Could not create user: ${error.stack}`)
          });
      } else {
        resolve({ statusCode: 200, headers: corsHeaders,  body: JSON.stringify(data.Items) });
      }
    });
  });
}

/*****************************************************************
 Funcao responsavel por criar usuarios com o papel selecionado
 endpoint: POST /users
 visibilidade: <admin>
 deploy: sls deploy function -f autenticacao_createUser
******************************************************************/
module.exports.createUser = async (event, context) => {
  
  //Carrega usuário enviado via POST
  let user = null;  
  let _parsed;
  try {
    user = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({error:"Erro ao carregar dados"})
    };
  }

  //Valida usuario (campos obrigatorios)
  if(!validateUser(user)) {
    console.error("Usuario invalido");
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({error:"Usuario invalido!"})
    };
  }

  // Cria um id para o usuario
  if (!user.id)
    user.id = uuid.v1();
  
  //Adiciona campos automaticos (Data de criacao e alteracao).
  const timestamp = (new Date()).toISOString();
  user = {...user, submittedAt: timestamp, updatedAt: timestamp}

  // Verifica se ja existe um usuario com esse login (username)
  var usersWithSameLogin = await getUserByLogin(user.username);
  if(usersWithSameLogin) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({error:"Usuario existente!"})
    };
  } 

  //Grava usuário no banco
  const params = {
    TableName: USUARIOS_TABLE,
    Item: user
  };
  return await new Promise((resolve, reject) => {
    dynamoDb.put(params, (error, data) => {
      if (error) {
        console.log(`createUser ERROR=${error.stack}`);
          resolve({
            statusCode: 400,
            headers: corsHeaders
            //body: JSON.stringify(`Could not create user: ${error.stack}`)
          });
      } else {
        resolve({ statusCode: 200, headers: corsHeaders, body: JSON.stringify(user) });
      }
    });
  });
  
};






const validateUser = (value) => {
  if (typeof value.username !== 'string' || typeof value.password !== 'string' || typeof value.nome !== 'string' || typeof value.role !== 'string') {
    return false;
  }
  return true;
}

const getUserByLogin = (username) => {

  var key = { "username": username };

  const params = {
    TableName: USUARIOS_TABLE,
    IndexName: "username-index",
    FilterExpression:'username = :username',
    ExpressionAttributeValues:{ ":username" : username },
    ScanIndexForward: false
  }

  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, data) => {
      if (error) {
        console.log(`getUserByLogin ERROR=${error.stack}`);
          reject(error);
      } else {
        if (data.Count > 0) {
          resolve(data.Items[0]);
        } else {
          resolve(null);
        }
      }
    });
  });
  
} 



const getUserByID = (id) => {

  var key = { "id": id };

  const params = {
    TableName: USUARIOS_TABLE,
    Key: key
  }

  return new Promise((resolve, reject) => {
    dynamoDb.get(params, (error, data) => {
      if (error) {
        console.log(`getUserById ERROR=${error.stack}`);
          reject(error);
      } else {
        resolve(data.Item);
      }
    });
  });
  
} 