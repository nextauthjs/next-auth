#!/usr/bin/env bash

echo "Initializing container for PostgreSQL tests."

PG_USER=user
PG_DATABASE=db
PG_CONTAINER_NAME=authjs-orchid-orm-test

docker run -d --rm \
  -e POSTGRES_USER=${PG_USER} \
  -e POSTGRES_DB=${PG_DATABASE} \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  --name "${PG_CONTAINER_NAME}" \
  -p 5432:5432 \
  postgres

echo "waiting 5s for db to start..."
sleep 5
./node_modules/.bin/tsx ./test/db/dbScript.ts up

if vitest run -c ../utils/vitest.config.ts ./test/index.test.ts; then
  docker stop ${PG_CONTAINER_NAME}
else
  docker stop ${PG_CONTAINER_NAME} && exit 1
fi
