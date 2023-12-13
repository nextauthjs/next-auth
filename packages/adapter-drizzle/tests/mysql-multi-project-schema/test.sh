#!/usr/bin/env bash

echo "Initializing container for MySQL tests."

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

echo "Waiting 15 sec for db to start..." && sleep 15

drizzle-kit generate:mysql --config=./tests/mysql/drizzle.config.ts
drizzle-kit push:mysql --config=./tests/mysql/drizzle.config.ts
jest ./tests/mysql/index.test.ts --forceExit
docker stop ${MYSQL_CONTAINER_NAME}