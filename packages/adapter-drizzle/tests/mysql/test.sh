#!/usr/bin/env bash

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

drizzle-kit generate:mysql --config=./src/mysql/drizzle.config.ts
drizzle-kit push:mysql --config=./src/mysql/drizzle.config.ts

echo "Started running MySQL tests."
jest ./tests/mysql/zero-config.test.ts
echo "Finished running MySQL tests."

echo "Started running MySQL tests with custom models."
CUSTOM_MODEL=1 jest ./tests/mysql/custom.test.ts
echo "Finished running MySQL tests with custom models."
