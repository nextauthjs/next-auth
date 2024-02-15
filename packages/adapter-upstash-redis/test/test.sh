#!/usr/bin/env bash

echo "Initializing container for Upstash-Redis tests (Serverless-Redis-HTTP)"

# Init Redis + serverless-redis-http containers
docker compose up -d

echo "Waiting 10 sec for Redis to start..."
sleep 10

# Always stop container, but exit with 1 when tests are failing
if vitest -c ../utils/vitest.config.ts; then
  docker compose down -v
else
  docker compose down -v && exit 1
fi
