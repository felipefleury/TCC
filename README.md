# Comercio Eletrônico com Dropshipping

Projeto criado para validar a arquitetura de software proposta para o trabalho de conclusão de curso. 

O objetivo deste projeto é testar a arquitetura e a integração entre os projetos. O uso do framework serverless e das tecnologias disponibilizadas pela Amazon permite a criação de uma estrutura flexível e com alta-performance. 
O front end desenvolvido é somente um modelo de programação que serve como guia para o desenvolvimento da interface definitiva. Neste front end temos o uso do React com autenticação via JWT e controle de estado com redux.

Este projeto está separado em 3 partes.

- Modulos - Backend da aplicação
- Front End - Interface WEB para testes
- Testes - Testes automatizados

# Instruções para instalação e uso

- Instalação do backend

1. inicialmente é necessário criar um banco SQL Server com os objetos do script em /documentacao/startup/SQL Database.sql
2. Colocar os dados de acesso no arquivo env_example.yml dentro de /modulos e renomear para env.yml
3. Configurar as credenciais da AWS na sua conta
4. rodar "npm install" no diretorio modulos
5. rodar o comando "sls deploy" dentro da pasta modulos
6. Anotar o endereço de acesso ao backend
7. Na pasta documentacao/startup/startup.js temos um script para a criação de dados de testes.

- Rodar os testes do backend

1. Colocar nos arquivos de testes o endereço do backend
2. Rodar o comando "npm install" no diretorio modulos
3. rodar "npm run test"

- Rodar o front-end

1. Alterar no arquivo "/frontend/src/util/settings.js" o endereço para o backend
2. Rodar o comando "npm install" no diretorio frontend
3. Executar o front end com "npm start"

# Tecnologias utilizadas

Módulos
- NodeJS
- Javascript
- AWS Lambda
- AWS Gateway
- Serverless
- DynamoDB
- SQL Server
- AWS SQS
- JWT

Front end
- React
- Redux
- Javascript
- Axios
- MaterializeCss

Testes
- Javascript
- Mocha
- Chai



# contato
Luis Felipe A. Fleury 

- felipefleury@gmail.com
- https://www.linkedin.com/in/luis-felipe-assump%C3%A7%C3%A3o-fleury-b7a32294/


