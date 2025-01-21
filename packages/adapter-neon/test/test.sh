#!/usr/bin/env bash

# Start PostgreSQL container
docker run -d --rm \
  --name postgres \
  -e POSTGRES_DB=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v "$(pwd)"/schema.sql:/docker-entrypoint-initdb.d/schema.sql \
  postgres:latest

# Start pg_proxy container
docker run -d --rm \
  --name pg_proxy \
  -e APPEND_PORT="postgres:5432" \
  -e ALLOW_ADDR_REGEX=".*" \
  -e LOG_TRAFFIC="true" \
  -p 5433:80 \
  --link postgres:postgres \
  ghcr.io/neondatabase/wsproxy:latest

echo "waiting 5s for db to start..."
sleep 5

# Always stop containers, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop pg_proxy && docker stop postgres
else
  docker stop pg_proxy && docker stop postgres && exit 1
fi
