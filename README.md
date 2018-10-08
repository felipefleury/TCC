# Comercio Eletrônico com Dropshipping

Projeto criado para validar a arquitetura de software proposta para o trabalho de conclusão de curso 

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




