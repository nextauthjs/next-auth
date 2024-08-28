#!/usr/bin/env bash

echo "Initializing container for Upstash-Redis tests (Serverless-Redis-HTTP)"

# Init Redis + serverless-redis-http containers
docker compose up -d

echo "Waiting 5s for db to start..."
sleep 5

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker compose down -v
else
  docker compose down -v && exit 1
fi
