process.env.URL = 'https://mqggl9cika.execute-api.us-east-2.amazonaws.com/dev/';
require('./users');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let url = process.env.URL;
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
//Our parent block
describe('Testes da API de estoque', () => {
    /*
    beforeEach((done) => { //Before each test we empty the database
        //Book.remove({}, (err) => { 
        done();           
        //});        
    });
    */

    const idFornecedor = 'c9996726-6214-4308-865a-d9f8b31e67e9';
    const idOutroFornecedor = 'ec3abff2-2181-46ba-9478-7815af31fbaf';
    let token = '';
    const estoque = [
        {
            idProduto: "0263e370-a962-11e8-92a2-894f229c38d1",
            quantidade: 40
        }
        ,
        {
            idProduto: "776909c1-3702-4b39-9e4b-fbbde3022fb9",
            quantidade: 5
        }
        ,
        {
            idProduto: "586598b2-cb3a-4851-afbe-5c65126b4504",
            quantidade: 6
        }
        ,
        {
            idProduto: "da1e758f-d00a-481e-adc5-1c8c4294c22d",
            quantidade: 7
        }
        ,
        {
            idProduto: "4b68583f-764a-42cf-9b34-63847d716e5f",
            quantidade: 8
        }
        ,
        {
            idProduto: "b9e302f7-9760-43a2-a93e-50b4341cc02a",
            quantidade: 9
        }
        ,
        {
            idProduto: "e9252b39-1a84-4c90-b41b-5dc03e19def5",
            quantidade: 10
        }
        ,
        {
            idProduto: "1b0a2c95-e51a-4b34-a855-dbbbc893fb41",
            quantidade: 11
        }
        ,
        {
            idProduto: "730353ae-7f37-4327-968c-7824b2fe51ea",
            quantidade: 12
        }
        ];


/*
  * Test the /GET route
  */

  describe('Testes das APIs de fornecedores', () => {
      it('rejeita chamada de usuário não autenticado', (done) => {
        chai.request(url)
            .post(`/fornecedores/${idFornecedor}/estoque`)
            .send(estoque)
            .end((err, res) => {
                  res.should.have.status(401);
                  res.body.error.should.be.a('string');
                  res.body.error.should.be.eql('Access denied');
              done();
            });
      });
      it('faz o login do usuario', (done) => {
        chai.request(url)
            .post('/login')
            .send({ username: "fornecedor1", password:"123" })
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('string');
                  token = res.body;
                  let user = jwt.decode(res.body);
                  user.should.be.a('object');
                  user.id.should.be.eql(idFornecedor)
              done();
            });
      });
      it('Envia estoque dos produtos com o usuário autenticado', (done) => {
        chai.request(url)
            .post(`/fornecedores/${idFornecedor}/estoque`)
            .set("Authorization", token)
            .send(estoque)
            .end((err, res) => {
                  res.should.have.status(200);
              done();
            });
      });
      it('Tenta chamada errada com usuário autenticado ', (done) => {
        chai.request(url)
            .post(`/fornecedores/${idOutroFornecedor}/estoque`)
            .set("Authorization", token)
            .send(estoque)
            .end((err, res) => {
                  res.should.have.status(403);
                  res.body.error.should.be.a('string');
                  res.body.error.should.have.string('Access denied');                  
              done();
            });
      });
      it('Tenta buscar a lista de produtos do fornecedor sem estar logado', (done) => {
        chai.request(url)
            .get(`/fornecedores/${idFornecedor}/estoque`)
            .end((err, res) => {
                  res.should.have.status(401);              
              done();
            });
      });
      it('Não permite buscar a lista de produtos de um outro fornecedor', (done) => {
        chai.request(url)
            .get(`/fornecedores/${idOutroFornecedor}/estoque`)
            .end((err, res) => {
                  res.should.have.status(401);              
              done();
            });
      });
      it('Buscar lista de produtos do fornecedor logado', (done) => {
        chai.request(url)
            .get(`/fornecedores/${idFornecedor}/estoque`)
            .set("Authorization", token)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');                 
              done();
            });
      });
      
  });

  

});