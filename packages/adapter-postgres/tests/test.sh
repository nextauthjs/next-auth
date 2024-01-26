#!/usr/bin/env bash

docker run --name postgres-adapter \
  -d \
  -e POSTGRES_DB=postgresjs-test \
  -e POSTGRES_USER=dev \
  -e POSTGRES_PASSWORD=xoxo \
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
