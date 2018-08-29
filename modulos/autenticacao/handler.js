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


module.exports.deleteUser = async (event, context) => {

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
    TableName: USUARIOS_TABLE
  };

  console.log("Attempting a conditional delete...");
  return await new Promise((resolve, reject) => {
    dynamoDb.delete(params, (error, data) => {
      if (error) {
        console.error("Unable to delete item. Error JSON:" + JSON.stringify(error, null, 2));
        resolve({
          statusCode: 400,
          body: JSON.stringify({error:`Could not delete user: ${error.stack}`})
        });
  
      } else {
        resolve({ statusCode: 200});
      };
    });
  });
  
}

module.exports.authenticate = async (event, context) => {
  


  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 500
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
        // caso a senha do usuário seja encontrada.... iremos criar um token:
        var token = jwt.sign(user, JWT_ENCRYPTION_CODE, {
          expiresIn: '24h' //o token irá expirar em 24 hora2
        });
        return({ statusCode: 200, body: JSON.stringify(token) })
      }
  }
  return({ statusCode: 404, body: JSON.stringify({ error: "usuario ou senha invalida!" }) })


  /*sssss

  const params = {
    TableName: USUARIOS_TABLE,
    IndexName: "username-index",
    FilterExpression:'username = :username',
    ExpressionAttributeValues:{ ":username" : username },
    ScanIndexForward: false
  }

  return await new Promise((resolve, reject) => {
    dynamoDb.scan(params, (error, data) => {
      if (error) {
        console.log(`autenticate ERROR=${error.stack}`);
          resolve({
            statusCode: 400,
            body: JSON.stringify({error:`Could not autenticate: ${error.stack}`})
          });
      } else {
        console.log(data);
        var key = { "id": data["Items"]["id"] };
        console.log(key);
        const paramsget = {
          Key: key, 
          TableName: USUARIOS_TABLE
        };
        dynamoDb.get(paramsget, (error, data) => {
          if (error) {
            console.log(`autenticate ERROR=${error.stack}`);
              resolve({
                statusCode: 400,
                body: JSON.stringify({error:`Could not autenticate: ${error.stack}`})
              });
          } else {
            console.log(data);
            if (data.length == 1) {
              var senha = data["Item"]["password"];
              if (password == senha) {
                // caso a senha do usuário seja encontrada.... iremos criar um token:
                var token = jwt.sign(data, JWT_ENCRYPTION_CODE, {
                  expiresIn: '1h' //o token irá expirar em 24 horas
                });
                resolve({ statusCode: 200, body: JSON.stringify(token) });
                console.log("FIM!!!!!!!!!!!");
              }
            }
          }
        });
        resolve({ statusCode: 400, body: JSON.stringify({error:"Usuario ou senha inválida!"})});
      }
    });
  });
  */
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
 Funcao responsavel por listar os usuarios com o papel selecionado
 Apenas a listagem de fornecedores é liberada
 endpoint: POST /fornecedor/{id}/estoque
 visibilidade: <admin> ou publico caso o papel seja fornecedor
******************************************************************/
module.exports.listarUsuarios = async  (event, context) => {

  let role = event.pathParameters.role; 

  const params = {
    TableName: USUARIOS_TABLE,
    IndexName: "userrole-index",
    FilterExpression:'#userrole = :filterrole',
    ExpressionAttributeNames: { "#userrole" : "role"},
    ExpressionAttributeValues:{ ":filterrole" : role },
    ProjectionExpression: "id, nome",
    ScanIndexForward: false
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
        resolve({ statusCode: 200, headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true, 
        },  body: JSON.stringify(data.Items) });
      }
    });
  });
}

/*****************************************************************
 Funcao responsavel por criar usuarios com o papel selecionado
 endpoint: POST /users/{id}/estoque
 visibilidade: <admin> DURANTE A FASE DE TESTES O ACESSO ESTA LIBERADO
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
      body: JSON.stringify({error:"Erro ao carregar dados"})
    };
  }

  //Valida usuario (campos obrigatorios)
  if(!validateUser(user)) {
    console.error("Usuario invalido");
    return {
      statusCode: 400,
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
  if(usersWithSameLogin.Count > 0) {
    return {
      statusCode: 400,
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
            statusCode: 400//,
            //body: JSON.stringify(`Could not create user: ${error.stack}`)
          });
      } else {
        resolve({ statusCode: 200, body: JSON.stringify(user) });
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