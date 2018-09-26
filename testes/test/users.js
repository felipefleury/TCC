process.env.URL = 'https://mqggl9cika.execute-api.us-east-2.amazonaws.com/dev/';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();
chai.use(require('chai-things'));

let url = process.env.URL;
let tokenAdministrador = '';
const jwt = require("jsonwebtoken");

chai.use(chaiHttp);
//Our parent block
describe('Verifica APIs de usuários', () => {
    
    before((done) => { //Before each test we empty the database
        console.log("Limpando dados");
        let token = '';
        chai.request(url)
            .post('/login')
            .send({ username: "administrador", password:"A12kasm45" })
            .end((err, res) => {
                  token = res.body;
                  chai.request(url)
                    .delete('/users/a0bb9d90-c0d4-11e8-b4a3-ed13d77668da')
                    .set("Authorization", token)
                    .end((err, res) => {
                            console.log(res.status);    
                    done();
                    });      
            });
    });

    it('tenta o login do usuario administrador com senha errada', (done) => {
        chai.request(url)
            .post('/login')
            .send({ username: "administrador", password:"errada" })
            .end((err, res) => {
                  res.should.have.status(404);
                  res.body.should.be.a('object');
                  res.body.error.should.be.a('string');     
              done();
            });
      });
    it('faz o login do usuario administrador', (done) => {
        chai.request(url)
            .post('/login')
            .send({ username: "administrador", password:"A12kasm45" })
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('string');
                  tokenAdministrador = res.body;
                  let user = jwt.decode(res.body);
                  user.should.be.a('object');
              done();
            });
      });
    
 /*
  * Test the /GET route
  */
  describe('Criar usuários', () => {
      it('tenta cadastrar usuário cliente', (done) => {
        chai.request(url)
            .post('/users')
            .send({
                id: "a0bb9d90-c0d4-11e8-b4a3-ed13d77668da", // O id é opcional
                email: "felipefleury@gmail.com",
                nome: "Luis Felipe",
                password: "123",
                role:"cliente",
                username: "teste"
              })
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.username.should.be.eql("teste");
              done();
            });
      });
  });

  describe('verifica usuarios', () => {
    it('Não permite a listagem de usuarios cadastrados sem estar autenticado', (done) => {
        chai.request(url)
            .get('/users')
            .end((err, res) => {
                  res.should.have.status(401);
                  res.body.error.should.be.a('string');
                  res.body.error.should.be.eql('Access denied');                  
              done();
            });
        });      
    it('carrega lista dos usuarios cadastrados e verifica se o novo usuário esta presente', (done) => {
      chai.request(url)
          .get('/users')
          .set("Authorization", tokenAdministrador)
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array').contain.a.thing.with.property('id', 'a0bb9d90-c0d4-11e8-b4a3-ed13d77668da');
                res.body.should.to.include.a('array');
            done();
          });
      });
  });
  describe('Limpa dados de testes', () => {
        it('Apagar usuario cadastrado', (done) => {
            chai.request(url)
            .delete('/users/a0bb9d90-c0d4-11e8-b4a3-ed13d77668da')
            .set("Authorization", tokenAdministrador)
            .end((err, res) => {
                res.should.have.status(200);    
            done();
            });    
        });
    });
});