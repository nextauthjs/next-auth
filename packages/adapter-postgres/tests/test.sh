#!/usr/bin/env bash

docker run --name postgres-adapter \
  -d \
  -e POSTGRES_DB=postgresjs-test \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -p 5432:5432 \
  -v "$(pwd)"/setup.sql:/docker-entrypoint-initdb.d/setup.sql \
  postgres:13.3


echo "waiting 10 seconds for databases to start..."
sleep 10

# Always stop container, but exit with 1 when tests are failing
if npx jest tests; then
  docker stop postgres-adapter
else
  docker stop postgres-adapter && exit 1
fi
