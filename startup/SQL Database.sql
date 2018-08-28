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

CREATE TABLE Reserva
(
    idProduto UNIQUEIDENTIFIER,
    idFornecedor UNIQUEIDENTIFIER,
    idCliente UNIQUEIDENTIFIER,
    quantidade int,
    dataReserva datetime,
    CONSTRAINT PK_Reserva primary key clustered 
    (idProduto, idFornecedor, idCliente)
)

GO
ALTER PROCEDURE proc_BuscaEstoqueProduto
@IDPRODUTO UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON

    DECLARE @DATALIMITE AS DATETIME
    SET @DATALIMITE = DATEADD(hour, -1, GETDATE())

    SELECT  Quantidade - ISNULL((SELECT SUM(res.Quantidade) 
                           FROM Reserva res 
                          WHERE res.idProduto = est.idProduto 
                            and res.idFornecedor = est.idFornecedor 
                            and res.dataReserva >= @DATALIMITE), 0) quantidade, 
            idFornecedor  
    FROM Estoque est
    WHERE idProduto = @IDPRODUTO
END

GO

ALTER PROCEDURE proc_AtualizaEstoqueProduto
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

CREATE LOGIN userTCC WITH PASSWORD =  'mg54sasd442@'
CREATE USER userTCC FOR LOGIN userTCC


GRANT EXECUTE ON OBJECT::proc_BuscaEstoqueProduto
    TO userTCC;

GRANT EXECUTE ON OBJECT::proc_AtualizaEstoqueProduto
TO userTCC;