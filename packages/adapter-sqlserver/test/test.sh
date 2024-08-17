#!/usr/bin/env bash

CONTAINER_NAME=authjs-sqlserver-test
DATABASE_NAME=adapter-sqlserver-test

docker run -d --rm \
  --name ${CONTAINER_NAME} \
  -e MSSQL_SA_PASSWORD=Authjs!password \
  -e ACCEPT_EULA=Y \
  -p 1433:1433 \
  -v "$(pwd)"/schema.sql:/home/schema.sql \
  mcr.microsoft.com/mssql/server:2022-latest

echo "waiting 5s for db to start..."
sleep 10

docker exec ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P Authjs!password -d master -Q "CREATE DATABASE [${DATABASE_NAME}]"
docker exec ${CONTAINER_NAME} /opt/mssql-tools18/bin/sqlcmd -C -S localhost -U sa -P Authjs!password -d ${DATABASE_NAME} -i /home/schema.sql

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
