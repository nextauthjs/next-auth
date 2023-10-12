#!/usr/bin/env bash

docker run --name pg-adapter \
  -d \
  -e POSTGRES_DB=adapter-postgres-test \
  -e POSTGRES_USER=pg \
  -e POSTGRES_PASSWORD=pg \
  -p 5432:5432 \
  -v "$(pwd)"/schema.sql:/docker-entrypoint-initdb.d/schema.sql \
  postgres:latest

echo "waiting 10 seconds for databases to start..."
sleep 10

# Always stop container, but exit with 1 when tests are failing
if npx jest tests; then
  docker stop pg-adapter
else
  docker stop pg-adapter && exit 1
fi
