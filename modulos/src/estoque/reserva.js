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
 Funcao responsavel por reservar um produto.
 endpoint: 
 visibilidade:
*************************************************************/
module.exports.insereReserva = async (event, context) => {
  // Faz a conversao entre json e objeto
  let _parsed;
  try {
    _parsed = JSON.parse(value);
  } catch (err) {
    console.error(`Could not parse requested JSON ${value}: ${err.stack}`);
    throw err;
  }
  // Pega valor passado como parametro
  let idProduto = _parsed.idProduto;
  let idQuantidade = _parsed.quantidade;
  let idCliente = 'dbe451e6-65b9-48d3-966c-a2b77ff699be';

  idProduto = idProduto.replace(/'/g,'\'\'');  // Substitui aspas simples para evitar ataques de SQL Injection
  idQuantidade = idQuantidade.replace(/'/g,'\'\'');  // Substitui aspas simples para evitar ataques de SQL Injection

  // Fecha conexao anterior se ainda estiver aberta
  sql.close();
  
  return await new Promise((resolve, reject) => {
    //Abre conexao com o banco de dados
    sql.connect(connStr)
    .then(conn => {
      //Cria consulta
      var request = new sql.Request(conn);
      return request.query(`proc_InserirReserva '${idProduto}', '${idCliente}', ${quantidade}`);
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
