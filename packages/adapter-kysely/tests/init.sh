#!/usr/bin/env bash

# Init PostgreSQL container
echo "Initializing container for PostgreSQL tests"

PGUSER=nextauth
PGDATABASE=nextauth
PGPORT=5432
PG_CONTAINER_NAME=next-auth-postgres-test

docker run -d --rm -e POSTGRES_USER=${PGUSER} -e POSTGRES_DB=${PGDATABASE} -e POSTGRES_HOST_AUTH_METHOD=trust --name "${PG_CONTAINER_NAME}" -p 5432:5432 postgres:13.3

WAIT=5
echo "Waiting ${WAIT} sec for PostgreSQL db to be up..."
sleep ${WAIT}

ts-node ./tests/migrate.ts

set -eu

echo "Started running PostgreSQL tests with default models."
jest index.test.ts
echo "Finished running PostgreSQL tests with default models."

docker rm -f "${PG_CONTAINER_NAME}"