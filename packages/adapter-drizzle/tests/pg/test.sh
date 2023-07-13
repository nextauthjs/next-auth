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
postgres:15.3

drizzle-kit generate:pg --config=./tests/pg/drizzle.config.ts

npx tsx ./tests/pg/migrate-db.ts

echo "Started running Postgres tests."
jest ./tests/pg/zero-config.test.ts --forceExit
echo "Finished running Postgres tests."

# echo "Started running Postgres tests with custom models."
# jest ./tests/pg/custom.test.ts --forceExit
# echo "Finished running Postgres tests with custom models."
