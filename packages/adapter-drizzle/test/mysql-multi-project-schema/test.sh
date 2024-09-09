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
  mysql:8

echo "Waiting 10s for db to start..." && sleep 10

drizzle-kit generate --config=./test/mysql-multi-project-schema/drizzle.config.ts
drizzle-kit migrate --config=./test/mysql-multi-project-schema/drizzle.config.ts

if vitest run -c ../utils/vitest.config.ts ./test/mysql-multi-project-schema/index.test.ts; then
  docker stop ${MYSQL_CONTAINER_NAME}
else
  docker stop ${MYSQL_CONTAINER_NAME} && exit 1
fi
