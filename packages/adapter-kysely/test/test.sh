#!/usr/bin/env bash

MYSQL_CONTAINER_NAME=authjs-kysely-mysql-test
PG_CONTAINER_NAME=authjs-kysely-pg-test

docker run -d --rm \
  --name ${MYSQL_CONTAINER_NAME} \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=kysely_test \
  -p 3308:3306 \
  -v "$(pwd)"/test/scripts/mysql-init.sql:/data/application/init.sql \
  mysql/mysql-server \
  --init-file /data/application/init.sql

docker run -d --rm \
  --name ${PG_CONTAINER_NAME} \
  -e POSTGRES_DB=kysely_test \
  -e POSTGRES_USER=kysely \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -p 5434:5432 \
  postgres

echo "waiting 10s for db to start..."
sleep 10

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop ${MYSQL_CONTAINER_NAME} && docker stop ${PG_CONTAINER_NAME}
else
  docker stop ${MYSQL_CONTAINER_NAME} && docker stop ${PG_CONTAINER_NAME} && exit 1
fi
