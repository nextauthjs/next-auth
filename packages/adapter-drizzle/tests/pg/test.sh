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

echo "Started running PostgreSQL tests."
jest ./pg/index.test.ts
echo "Finished running PostgreSQL tests."
