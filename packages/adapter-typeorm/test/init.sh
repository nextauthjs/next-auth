#!/usr/bin/env bash

# Init PostgreSQL container
echo "Initializing container for PostgreSQL tests"

PGUSER=nextauth
PGDATABASE=nextauth
PGPORT=5432
PG_CONTAINER_NAME=next-auth-postgres-test

docker run -d --rm \
-e POSTGRES_USER=${PGUSER} \
-e POSTGRES_DB=${PGDATABASE} \
-e POSTGRES_HOST_AUTH_METHOD=trust \
--name "${PG_CONTAINER_NAME}" \
-p ${PGPORT}:5432 \
postgres:13.3

# Init MyDQL container
echo "Initializing container for MySQL tests"

MYSQL_DATABASE=next-auth
MYSQL_ROOT_PASSWORD=password
MYSQL_CONTAINER_NAME=next-auth-mysql-test

docker run -d --rm \
-e MYSQL_DATABASE=${MYSQL_DATABASE} \
-e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
--name "${MYSQL_CONTAINER_NAME}" \
-p 3306:3306 \
mysql:8 \
--default-authentication-plugin=mysql_native_password


