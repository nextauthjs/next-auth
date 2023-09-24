CREATE USER 'kysely'@'%' IDENTIFIED WITH mysql_native_password BY 'kysely';
GRANT ALL ON *.* TO 'kysely'@'%';
CREATE DATABASE kysely_test;