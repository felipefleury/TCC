'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const sql = require("mssql");

const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;
const connStr = process.env.SQLCONNECTIONSTRING;

/************************************************************
 Funcao responsavel por retornar a quantidade disponivel do
 produto informado para cada fornecedor. O calculo leva em 
 conta a quantidade reservada em sessoes atuais
*************************************************************/
module.exports.estoqueProduto = async (event, context) => {
  // Pega valor passado como parametro no path da chamada 
  let idProduto = event.pathParameters.id;
  idProduto = idProduto.replace(/'/g,'\'\'');  // Substitui aspas simples para evitar ataques de SQL Injection
  // Fecha conexao anterior se ainda estiver aberta
  sql.close();
  return await new Promise((resolve, reject) => {
    //Abre conexao com o banco de dados
    sql.connect(connStr)
    .then(conn => {
      //Cria consulta
      var request = new sql.Request(conn);
      return request.query(`proc_BuscaEstoqueProduto '${idProduto}'`);
    })
    .then(result => {
      //Retorna resultados
      resolve({ statusCode: 200, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true, 
      },  body: JSON.stringify(result.recordset)});
      //fecha conexao
      sql.close();
    })
    .catch(err => {
      // Loga erro, fecha conexao e devolve o codigo de erro
      console.log("erro! " + err);
      sql.close();
      resolve({ statusCode: 500, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true, 
      },  body: JSON.stringify({error: err})});
    });
  });

}
