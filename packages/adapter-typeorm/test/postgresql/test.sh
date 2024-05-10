#!/usr/bin/env bash
set -eu

# Init PostgreSQL container
echo "Initializing container for PostgreSQL tests"

PGUSER=nextauth
PGDATABASE=nextauth
PG_CONTAINER_NAME=next-auth-postgres-test

function startDatabase {
  docker run -d --rm \
    -e POSTGRES_USER=${PGUSER} \
    -e POSTGRES_DB=${PGDATABASE} \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    --name "${PG_CONTAINER_NAME}" \
    -p 5432:5432 \
    postgres:13.3

  echo "Waiting 5s for db to start..."
  sleep 5
}

startDatabase
echo "Started running PostgreSQL tests with default models."
if vitest run -c ../utils/vitest.config.ts postgresql/index.test.ts; then
  docker stop ${PG_CONTAINER_NAME}
else
  docker stop ${PG_CONTAINER_NAME} && exit 1
fi
echo "Finished running PostgreSQL tests with default models."

startDatabase
echo "Started running PostgreSQL tests with custom models."
if CUSTOM_MODEL=1 vitest run -c ../utils/vitest.config.ts postgresql/index.custom.test.ts; then
  docker stop ${PG_CONTAINER_NAME}
else
  docker stop ${PG_CONTAINER_NAME} && exit 1
fi
echo "Finished running PostgreSQL tests with custom models."
