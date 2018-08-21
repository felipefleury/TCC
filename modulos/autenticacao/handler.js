'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

const USUARIOS_TABLE = process.env.USUARIOS_TABLE;
const AWS_DEPLOY_REGION = process.env.AWS_DEPLOY_REGION;
const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    api_version: '2012-08-10',
    region: AWS_DEPLOY_REGION
});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

module.exports.authenticate = async (event, context) => {
  
  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 500,
      error: `Could not parse requested JSON: ${err.stack}`
    };
  }
  const { username, password } = _parsed;


  var key = { "username": username };
  const params = {
    Key: key, 
    TableName: USUARIOS_TABLE
  };

  return await new Promise((resolve, reject) => {
    dynamoDb.get(params, (error, data) => {
      if (error) {
        console.log(`autenticate ERROR=${error.stack}`);
          resolve({
            statusCode: 400,
            error: `Could not autenticate: ${error.stack}`
          });
  
      } else {
        var senha = data["Item"]["password"];
        console.log(senha);
        console.log(password);
        console.log(`autenticate data=${senha}`);
        if (password == senha) {
          // caso a senha do usuário seja encontrada.... iremos criar um token:
          var token = jwt.sign(data, JWT_ENCRYPTION_CODE, {
            expiresIn: '1h' //o token irá expirar em 24 horas
          });
          console.log(token);
          resolve({ statusCode: 200, body: JSON.stringify(token) });
        } else {
          resolve({ statusCode: 400, body: "Usuario ou senha inválida" });
        }
      }
    });
  });
};

module.exports.createUser = async (event, context) => {

  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 500,
      error: `Could not parse requested JSON: ${err.stack}`
    };
  }

  const { username, password, nome, tipo, email } = _parsed;

  var teste = {..._parsed, teste:1 }

  console.log(teste);

  if(!validateUser(username, password, nome, tipo, email)) {
    return {
      statusCode: 500,
      error: 'Not valid!'
    }
  }
  console.log("Procurando usuario!");
  

  var value = await getUserByLogin(username);
  console.log(value);
  console.log(value.Count);

  if(value.Count > 0) {
    console.log("usuario existente!");
    return {
      statusCode: 500,
      error: "Existente!"
    }
  } 
  var user = userInfo(username, password, nome, tipo, email);
  
  
  
  saveUsuario(user)
  .then(result => {
    console.log(result);
    return{
      statusCode: 204
    }
  }).catch(error => {
    console.log(error);
    return{
      statusCode: 400
    }
  })
  
  
};


const saveUsuario = (userInfo) => {
  const params = {
    TableName: USUARIOS_TABLE,
    Item: userInfo
  };

  return dynamoDb.put(params).promise();
  /* 
  return await new Promise((resolve, reject) => {
    dynamoDb.put(params, (error, data) => {
      if (error) {
        console.log(`createUser ERROR=${error.stack}`);
          resolve({
            statusCode: 400,
            error: `Could not create user: ${error.stack}`
          });
  
      } else {
        console.log(`createUser data=${JSON.stringify(data)}`);
        resolve({ statusCode: 200, body: JSON.stringify(params.Item) });
      }
    });
  });
  */
}

const validateUser = (username, password, nome, tipo, email) => {
  if (typeof username !== 'string' || typeof password !== 'string' || typeof nome !== 'string' || typeof tipo !== 'string' || typeof email !== 'string') {
    console.error('Validation Failed');
    return false;
  }
  return true;
}

const getUserByLogin = (username) => {

  var key = { "username": username };
  /*
  const params = {
    Key: key, 
    IndexName: "username-index",
    TableName: USUARIOS_TABLE
  };
*/

  const params = {
  TableName: USUARIOS_TABLE,
  IndexName: "username-index",
    ProjectionExpression:'username', // remove this string if you want to get not only 'name'
    FilterExpression:'username = :username',
    ExpressionAttributeValues:{ ":username" : username }

  }
/*
payload = {
    TableName: USUARIOS_TABLE,
    IndexName: "email",
    KeyConditionExpression: "#index = :index_value",
    ExpressionAttributeNames:{
        "#index": "email"
    },
    ExpressionAttributeValues: {
        ":index_value": "test@gmail.com" // <----------------
    },
    ProjectionExpression: "user_id",
        ScanIndexForward: false
    };
}
*/
  console.log("buscar dados");
  //return dynamoDb.get(params).promise();

  return new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, data) => {
      console.log("teste");
      if (error) {
        console.log(`getUserByLogin ERROR=${error.stack}`);
          reject(error);
      } else {
        console.log(data);
          resolve(data);
      }
    });
  });
  
} 

const userInfo = (username, password, nome, tipo, email) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    username: username,
    email: email,
    nome: nome,
    password: password,
    tipo: tipo,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};