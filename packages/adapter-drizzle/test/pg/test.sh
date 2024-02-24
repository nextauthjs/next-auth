#!/usr/bin/env bash

echo "Initializing container for PostgreSQL tests."

PGUSER=nextauth
PGPASSWORD=nextauth
PGDATABASE=nextauth
PGPORT=5432
PG_CONTAINER_NAME=next-auth-postgres-test

docker run -d --rm \
-e POSTGRES_USER=${PGUSER} \
-e POSTGRES_PASSWORD=${PGUSER} \
-e POSTGRES_DB=${PGDATABASE} \
-e POSTGRES_HOST_AUTH_METHOD=trust \
--name "${PG_CONTAINER_NAME}" \
-p ${PGPORT}:5432 \
postgres:15.3

echo "Waiting 15 sec for db to start..." && sleep 15

NODE_OPTIONS='--import tsx' drizzle-kit generate:pg --config=./test/pg/drizzle.config.ts
tsx ./test/pg/migrator.ts
vitest -c ../utils/vitest.config.ts ./test/pg/index.test.ts
docker stop ${PG_CONTAINER_NAME}