CREATE DATABASE TCC_Estoque
GO

USE TCC_Estoque

GO

CREATE TABLE Estoque
(
    idProduto UNIQUEIDENTIFIER,
    idFornecedor UNIQUEIDENTIFIER,
    quantidade int, 
    CONSTRAINT PK_Estoque primary key clustered 
    (idProduto, idFornecedor)
)


GO
CREATE PROCEDURE proc_BuscaEstoqueProduto
@IDPRODUTO UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON
    SELECT  SUm(Quantidade) quantidade
    FROM Estoque est
    WHERE idProduto = @IDPRODUTO
END

GO

CREATE PROCEDURE [dbo].[proc_EstoqueProdutoFornecedor]
@IDFORNECEDOR AS UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON
    SELECT idProduto, quantidade FROM Estoque
    WHERE idFornecedor = @IDFORNECEDOR 

 END


GO
CREATE PROCEDURE proc_AtualizaEstoqueProduto
@IDFORNECEDOR AS UNIQUEIDENTIFIER,
@JSON AS VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON
 
    -- CARREGA OS VALORES ENVIADOS VIA JSON EM UMA TABELA TEMPORARIA
    SELECT idProduto, quantidade
    INTO #ESTOQUE
    FROM OPENJSON(@JSON) 
    WITH (idProduto uniqueidentifier '$.idProduto', 
          quantidade int '$.quantidade')
 
    -- REALIZA UM MERGE NAS TABELAS PARA ATUALIZAR OS DADOS TRANSMITIDOS
    MERGE Estoque AS TARGET
    USING #ESTOQUE AS SOURCE 
    ON (TARGET.idProduto = SOURCE.idProduto AND TARGET.idFornecedor = @IDFornecedor) 
        WHEN MATCHED AND TARGET.quantidade <> SOURCE.quantidade THEN 
            UPDATE SET TARGET.quantidade = SOURCE.quantidade
        WHEN NOT MATCHED BY TARGET THEN 
            INSERT (idProduto, idFornecedor, quantidade) 
            VALUES (SOURCE.idProduto, @IDFORNECEDOR, SOURCE.quantidade)
        WHEN NOT MATCHED BY SOURCE AND TARGET.idFornecedor = @IDFORNECEDOR THEN 
            DELETE;


END

GO

CREATE LOGIN userTCC WITH PASSWORD =  'xxxxxxxxxxxxxxx'
CREATE USER userTCC FOR LOGIN userTCC


GRANT EXECUTE ON OBJECT::proc_BuscaEstoqueProduto
    TO userTCC;

GRANT EXECUTE ON OBJECT::proc_AtualizaEstoqueProduto
TO userTCC;

GRANT EXECUTE ON OBJECT::proc_EstoqueProdutoFornecedor
TO userTCC;

GO
Create Database TCC_Pedidos
GO
USE TCC_Pedidos

GO
CREATE TABLE Pedidos (
    id int identity(1,1) NOT NULL,
    idUsuario UNIQUEIDENTIFIER NOT NULL,
    idFornecedor UNIQUEIDENTIFIER NOT NULL,
    cpfCnpj varchar(20) NOT NULL, 
    dataPedido datetime NOT NULL,
    nome varchar(100) NOT NULL,
    enderecoCobranca varchar(100),
    bairroCobranca varchar(50),
    cidadeCobranca varchar(50),
    ufCobranca char(2),
    enderecoEntrega varchar(100),
    bairroEntrega varchar(50),
    cidadeEntrega varchar(50),
    ufEntrega char(2),
    status varchar(1000),
    updatedAt datetime,
    submittedAt datetime,
    CONSTRAINT PK_Pedidos primary key clustered 
    (id)
)
GO


CREATE TABLE ItensPedido (
    idItem UNIQUEIDENTIFIER,
    idPedido int,
    idProduto UNIQUEIDENTIFIER,
    nomeProduto varchar(200), 
    quantidade int,
    precoCusto money,
    precoUnitario money,
    idPromocao UNIQUEIDENTIFIER,
    updatedAt datetime,
    submittedAt datetime,
    CONSTRAINT PK_ItensPedido primary key clustered 
    (idItem)
)
GO
CREATE PROCEDURE proc_PedidosLista
@IDFORNECEDOR AS UNIQUEIDENTIFIER = NULL,
@IDUSUARIO AS UNIQUEIDENTIFIER = NULL 
AS
BEGIN
    SET NOCOUNT ON
    SELECT id, nome, status, dataPedido, 123 total, 3 itens
    FROM Pedidos
    --WHERE (idFornecedor = @IDFORNECEDOR OR @IDFORNECEDOR is null)
    --ORDER (idUsuario = @IDUSUARIO OR @IDUSUARIO is null)
    
END
GO

GO

CREATE PROCEDURE proc_PedidosAtualizarStatus
@IDPEDIDO AS INT,
@IDFORNECEDOR AS UNIQUEIDENTIFIER,
@STATUS AS VARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON
    UPDATE Pedidos
    SET [status] = @STATUS
    WHERE id = @IDPEDIDO
     AND idFornecedor = @IDFORNECEDOR
END

GO

CREATE USER userTCC FOR LOGIN userTCC

GRANT EXECUTE ON OBJECT::proc_PedidosLista
    TO userTCC;

GRANT EXECUTE ON OBJECT::proc_PedidosAtualizarStatus
    TO userTCC;

/* MODULO DE ENTREGAS */


Create Database TCC_Entregas
GO
USE TCC_Entregas

GO
CREATE TABLE Entregas (
    id UNIQUEIDENTIFIER NOT NULL,
    idPedido int NOT NULL,
    idFornecedor UNIQUEIDENTIFIER NOT NULL,
    endereco varchar(100),
    bairro varchar(50),
    cidade varchar(50),
    uf char(2),
    status tinyint,
    updatedAt datetime,
    submittedAt datetime,
    CONSTRAINT PK_Entregas primary key clustered 
    (id)
)
GO


CREATE TABLE StatusEntrega (
    id int identity(1,1) NOT NULL,
    idEntrega UNIQUEIDENTIFIER,
    status varchar(1000),
    updatedAt datetime,
    submittedAt datetime,
    CONSTRAINT PK_StatusEntrega primary key clustered 
    (id)
)
GO

INSERT INTO Entregas (id, idPedido, idFornecedor, endereco, bairro, cidade, uf, status, updatedAt, submittedAt)
SELECT '962f1bd6-7185-4416-b0dc-37ce9ba1264c', 1, 'c9996726-6214-4308-865a-d9f8b31e67e9', 'Rua Antonio Leite, 213', 'Centro', 'São Paulo', 'SP', 1, GETDATE(), GETDATE() 


GO
ALTER PROCEDURE proc_EntregasLista
@IDFORNECEDOR AS UNIQUEIDENTIFIER = NULL,
@IDUSUARIO AS UNIQUEIDENTIFIER = NULL,
@IDPEDIDO AS INT = 0,
@STATUS AS TINYINT = 1
AS
BEGIN
    SET NOCOUNT ON
    SELECT E.id, idPedido, idFornecedor, endereco, bairro, cidade, uf, E.updatedAt, E.submittedAt, MAX(S.id) idStatus
    INTO #ENTREGAS  --
    FROM Entregas AS E LEFT JOIN StatusEntrega S on E.id = S.idEntrega
    WHERE (E.status = @STATUS) -- 1 - ENTREGA PENDENTE
    AND (idFornecedor = @IDFORNECEDOR OR @IDFORNECEDOR is null)
    AND (idPedido = @IDPEDIDO OR @IDPEDIDO = 0)
    GROUP BY E.id, idPedido, idFornecedor, endereco, bairro, cidade, uf, E.updatedAt, E.submittedAt
    
    SELECT E.id, idPedido, idFornecedor, endereco, bairro, cidade, uf,  ISNULL(S.status, 'Pendente') status, ISNULL(S.updatedAt, E.updatedAt) updatedAt, E.submittedAt  
    FROM #ENTREGAS AS E LEFT JOIN StatusEntrega S on E.id = S.idEntrega and E.idStatus = S.id 

END
GO
proc_EntregasLista
GO

ALTER PROCEDURE proc_EntregasAtualizarStatus
@IDENTREGA AS UNIQUEIDENTIFIER,
@IDFORNECEDOR AS UNIQUEIDENTIFIER,
@STATUS AS VARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON
    INSERT INTO StatusEntrega (idEntrega, status, updatedAt, submittedAt)
    SELECT id, @STATUS, GETDATE(), GETDATE()
    FROM Entregas
    WHERE id = @IDENTREGA
     AND idFornecedor = @IDFORNECEDOR
END

GO

CREATE USER userTCC FOR LOGIN userTCC

GRANT EXECUTE ON OBJECT::proc_EntregasLista
    TO userTCC;

GRANT EXECUTE ON OBJECT::proc_EntregasAtualizarStatus
    TO userTCC;

Select * FROM StatusEntrega 
