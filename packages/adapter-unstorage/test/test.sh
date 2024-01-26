#!/usr/bin/env bash

CONTAINER_NAME=authjs-unstorage-test

# Start db
docker run -d --rm -p 6379:6379 --name ${CONTAINER_NAME} redis/redis-stack-server:6.2.6-v10

sleep 10

# Always stop container, but exit with 1 when tests are failing
if CONTAINER_NAME=${CONTAINER_NAME} vitest -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
