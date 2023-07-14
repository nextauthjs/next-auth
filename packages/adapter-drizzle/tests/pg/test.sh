#!/usr/bin/env bash

# Init PostgreSQL container
echo "Initializing container for PostgreSQL tests"

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

drizzle-kit generate:pg --config=./tests/pg/zero-config/drizzle.config.ts

npx tsx ./tests/pg/zero-config/migrator.ts

echo "Started running Postgres tests."
jest ./tests/pg/zero-config/index.test.ts --forceExit
echo "Finished running Postgres tests."

# echo "Started running Postgres tests with custom models."
# jest ./tests/pg/custom.test.ts --forceExit
# echo "Finished running Postgres tests with custom models."

docker stop ${PG_CONTAINER_NAME}