USE master;
/* did you tear down the container ? */
if not exists (select name
from sys.syslogins
where name = 'nextauth')
CREATE LOGIN nextauth   
    WITH PASSWORD = 'password',
    CHECK_POLICY = OFF;   
GO
/* did you tear down the container ? */
if not exists (select name
from sys.databases
where name = 'nextauth' )
CREATE database nextauth
GO
/* did you tear down the container ? */
if not exists(select [name]
from sys.sysusers
where name= 'nextauth')
CREATE USER nextauth 
    WITH DEFAULT_SCHEMA =[dbo];  
GO
/* 
 * Adding user as sysadmin, 
 * So you can easily drop/create/re-create/alter the database
 * You will need to login to 'master' to do that
 */
exec sp_addsrvrolemember @loginame = N'nextauth', @rolename = N'sysadmin'

