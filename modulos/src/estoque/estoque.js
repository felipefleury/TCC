/************************************************************
 Autor: Luis Felipe Assumpção Fleury          Data:26/08/2018
 Modulo de Estoque
 Responsavel pelo controle de estoque e reserva de cada produto
*************************************************************/

'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const sql = require("mssql");

const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;
const connStr = process.env.SQLCONNECTIONSTRING;

/************************************************************
 Funcao responsavel para informar a quantidade de produtos 
 disponiveis de um fornecedor.
 endpoint: POST /fornecedor/{id}/estoque
 visibilidade: <fornecedor> ou <admin>
*************************************************************/
module.exports.estoqueFornecedor = async (event, context) => {
  // Pega valor passado como parametro no path da chamada 
  let idFornecedor = event.pathParameters.id;
  idFornecedor = idFornecedor.replace(/'/g,'\'\'');  // Substitui aspas simples para evitar ataques de SQL Injection
  // Fecha conexao anterior se ainda estiver aberta
  sql.close();
  return await new Promise((resolve, reject) => {
    //Abre conexao com o banco de dados
    sql.connect(connStr)
    .then(conn => {
      //Cria consulta
      console.log(event.body);
      var request = new sql.Request(conn);
      var queryString = `proc_AtualizaEstoqueProduto '${idFornecedor}', '${JSON.stringify(event.body)}'`;
      console.log(queryString);
      return request.query(`proc_AtualizaEstoqueProduto '${idFornecedor}', '${JSON.stringify(event.body)}'`);
    })
    .then(result => {
      //Retorna resultados
      resolve({ statusCode: 200, headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true, 
      }});
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



/************************************************************
 Funcao responsavel por retornar a quantidade disponivel do
 produto informado para cada fornecedor. O calculo leva em 
 conta a quantidade reservada em sessoes atuais
 endpoint: POST /produto/{id}/estoque
 visibilidade: pública
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
