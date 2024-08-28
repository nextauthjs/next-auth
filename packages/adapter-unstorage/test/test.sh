#!/usr/bin/env bash

CONTAINER_NAME=authjs-unstorage-test

# Start db
docker run -d --rm \
  -p 6379:6379 \
  --name ${CONTAINER_NAME} \
  redis/redis-stack:7.2.0-v10

sleep 10

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
