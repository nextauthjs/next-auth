#!/usr/bin/env bash

echo "Initializing container for PostgreSQL tests."

PGUSER=nextauth
PGPASSWORD=nextauth
PGDATABASE=nextauth
PGPORT=5432
PG_CONTAINER_NAME=next-auth-postgres-test

docker run -d --rm \
  -e POSTGRES_USER=${PGUSER} \
  -e POSTGRES_PASSWORD=${PGPASSWORD} \
  -e POSTGRES_DB=${PGDATABASE} \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  --name "${PG_CONTAINER_NAME}" \
  -p ${PGPORT}:5432 \
  postgres:15.3

echo "Waiting 5s for db to start..." && sleep 5

drizzle-kit generate --config=./test/pg-multi-project-schema/drizzle.config.ts
drizzle-kit migrate --config=./test/pg-multi-project-schema/drizzle.config.ts

if vitest run -c ../utils/vitest.config.ts ./test/pg-multi-project-schema/index.test.ts; then
  docker stop ${PG_CONTAINER_NAME}
else
  docker stop ${PG_CONTAINER_NAME} && exit 1
fi
