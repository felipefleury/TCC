/************************************************************
 Autor: Luis Felipe Assumpção Fleury          Data:20/09/2018
 Modulo de Pedidos
 Responsavel pelo controle dos pedidos
*************************************************************/

'use strict';
const AWS = require('aws-sdk');
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const validar = require("../util/validate");
const corsHeaders = require("../util/corsHeaders");


const JWT_ENCRYPTION_CODE = process.env.JWT_ENCRYPTION_CODE;
const connStr = process.env.SQLCONNECTIONSTRING_PEDIDOS;

/************************************************************
 Funcao responsavel por listar os pedidos pendentes.
 endpoint: POST /pedidos?pendentes
 visibilidade: <fornecedor>, <cliente>, <vendedor> ou <internos>
 deploy: sls deploy function -f pedidosListarPendentes
*************************************************************/
module.exports.pedidosListarPendentes = async (event, context) => {
  // Pega valor passado como parametro no path da chamada 
  
  console.log(event);

  const authUser = validar.validate(event.headers.Authorization);
  if (!authUser){
    return({ statusCode: 401, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }

  // fornecedores e clientes só podem ver seus pedidos 
  let idFornecedor = '';
  let idUsuario = '';
  
  if (authUser.role == 'fornecedor') idFornecedor = authUser.id;
  if (authUser.role == 'cliente') idUsuario = authUser.id;
  if (authUser.role == 'vendedor') idUsuario = authUser.id;

  // Fecha conexao anterior se ainda estiver aberta
  sql.close();
  return await new Promise((resolve, reject) => {
    //Abre conexao com o banco de dados
    sql.connect(connStr)
    .then(conn => {
      //Cria consulta
      console.log(event.body);
      var request = new sql.Request(conn);
      var queryString = `proc_PedidosLista ${prepareParameter(idFornecedor)}, ${prepareParameter(idUsuario)}`;
      console.log(queryString);
      return request.query(queryString);
    })
    .then(result => {
      //Retorna resultados
      resolve({ statusCode: 200, headers: corsHeaders, body: JSON.stringify(result.recordset)});
      //fecha conexao
      sql.close();
    })
    .catch(err => {
      // Loga erro, fecha conexao e devolve o codigo de erro
      console.log("erro! " + err);
      sql.close();
      resolve({ statusCode: 500, headers: corsHeaders,  body: JSON.stringify({error: err})});
    });
  });
}


const prepareParameter = (value) => {
  if (value == '') {
    return 'NULL';
  } else {
    return '\'' + value + '\'';
  }
  
}



/************************************************************
 Funcao responsavel para atualizar o status do pedido pelo fornecedor.
 endpoint: PUT /pedidos/{id}/status
 visibilidade: <fornecedor>
 deploy: sls deploy function -f pedidosAtualizarStatus
*************************************************************/
module.exports.pedidosAtualizarStatus = async (event, context) => {
  
  // Pega valor passado como parametro no path da chamada 
  let idPedido = event.pathParameters.id;
  let status = event.body;
  

  const authUser = validar.validate(event.headers.Authorization);
  if (!authUser){
    return({ statusCode: 401, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  if (!validar.checkRole(authUser, ['fornecedor'])){
    return({ statusCode: 403, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  
  // Fecha conexao anterior se ainda estiver aberta
  sql.close();
  return await new Promise((resolve, reject) => {
    //Abre conexao com o banco de dados
    sql.connect(connStr)
    .then(conn => {
      //Cria consulta
      console.log(event.body);
      var request = new sql.Request(conn);
      var queryString = `proc_PedidosAtualizarStatus ${idPedido}, '${authUser.id}', '${status}'`;
      console.log(queryString);
      return request.query(queryString);
    })
    .then(result => {
      //Retorna resultados
      resolve({ statusCode: 200, headers: corsHeaders});
      //fecha conexao
      sql.close();
    })
    .catch(err => {
      // Loga erro, fecha conexao e devolve o codigo de erro
      console.log("erro! " + err);
      sql.close();
      resolve({ statusCode: 500, headers: corsHeaders,  body: JSON.stringify({error: err})});
    });
  });
}

/************************************************************
 Funcao responsavel para enviar pedidos pelo cliente
 endpoint: POST /pedidos
 visibilidade: <cliente> ou <vendedor> 
 deploy: sls deploy function -f pedidosIncluir
*************************************************************/
module.exports.pedidosIncluir = async (event, context) => {
  
  // Pega valor passado como parametro no path da chamada 
  let _parsed;
  try {
    _parsed = JSON.parse(event.body);
  } catch (err) {
    console.error(`Could not parse requested JSON ${event.body}: ${err.stack}`);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({error:`Could not parse json: ${err.stack}`})
    };
  }

  const authUser = validar.validate(event.headers.Authorization);
  if (!authUser){
    return({ statusCode: 401, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  if (!validar.checkRole(authUser, ['vendedor', 'cliente'])){
    return({ statusCode: 403, headers: corsHeaders,  body: JSON.stringify({error: "Access denied"})});
  }
  
  let itens = _parsed.produtos.map(value => {
    var decoded = jwt.verify(value.token, JWT_ENCRYPTION_CODE);
    if (!decoded) {
      return({ statusCode: 400, headers: corsHeaders,  body: JSON.stringify({error: `Product token expired for id:${value.id}!`})});
    }
    return {quantidade: value.quantidade, preco: decoded.preco, idProduto: decoded.id, nome: value.produto}
  })

  console.log(itens);
  console.log(_parsed.faturamento);

  let pedido = {faturamento: _parsed.faturamento, itens: itens, idUsuario: authUser.id}
  console.log(JSON.stringify(pedido));
  
  // Fecha conexao anterior se ainda estiver aberta
  sql.close();
  return await new Promise((resolve, reject) => {
    //Abre conexao com o banco de dados
    sql.connect(connStr)
    .then(conn => {
      //Cria consulta
      console.log(event.body);
      var request = new sql.Request(conn);
      var queryString = `proc_PedidosIncluir '${JSON.stringify(pedido)}'`;
      console.log(queryString);
      return request.query(queryString);
    })
    .then(result => {
      //Retorna resultados
      resolve({ statusCode: 200, headers: corsHeaders});
      //fecha conexao
      sql.close();
    })
    .catch(err => {
      // Loga erro, fecha conexao e devolve o codigo de erro
      console.log("erro! " + err);
      sql.close();
      resolve({ statusCode: 500, headers: corsHeaders,  body: JSON.stringify({error: err})});
    });
  });
}

