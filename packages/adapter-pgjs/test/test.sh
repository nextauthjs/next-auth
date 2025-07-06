#!/usr/bin/env bash

echo "Initializing container for PostgresJS Tests."

PGUSER=pgjs
PGPASSWORD=pgjs
PGDATABASE=pgjs
PGPORT=6969
PG_CONTAINER_NAME=authjs-pgjs-test

docker run -d --rm \
  -e POSTGRES_USER=${PGUSER} \
  -e POSTGRES_PASSWORD=${PGPASSWORD} \
  -e POSTGRES_DB=${PGDATABASE} \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  --name "${PG_CONTAINER_NAME}" \
  -p ${PGPORT}:5432 \
  -v "$(pwd)"/schema.sql:/docker-entrypoint-initdb.d/schema.sql \
  postgres:latest

echo "Waiting 5s for db to start..." && sleep 5

if vitest run -c ../utils/vitest.config.ts ./test/index.test.ts; then
  docker stop ${PG_CONTAINER_NAME}
else
  docker stop ${PG_CONTAINER_NAME} && exit 1
fi
