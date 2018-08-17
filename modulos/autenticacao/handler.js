'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");

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

  const params = {
    TableName: USUARIOS_TABLE,
    Item: {
      username, password, nome, tipo, email
    },
  };

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
};