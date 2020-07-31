USE master;  
if not exists (select name from sys.syslogins where name = 'nextauth')
CREATE LOGIN nextauth   
    WITH PASSWORD = 'password',
    CHECK_POLICY = OFF;   
GO
if not exists (select name from sys.databases where name = 'nextauth' )
CREATE database nextauth
GO
USE nextauth;  
if not exists(select [name] from sys.sysusers where name= 'nextauth')
CREATE USER nextauth FOR LOGIN nextauth   
    WITH DEFAULT_SCHEMA =[dbo];  
GO
EXEC sp_addrolemember 'db_owner', 'nextauth'
