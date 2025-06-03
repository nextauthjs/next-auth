#!/usr/bin/env bash

CONTAINER_NAME=authjs-surrealdb-test

# Get the latest 2.x container since 3.x-alpha is not yet fully supported by js library
TAG=$(curl -s "https://registry.hub.docker.com/v2/repositories/surrealdb/surrealdb/tags?page_size=100" \
| jq -r '.results[].name' \
| grep -E '^v2\.[0-9]+(\.[0-9]+)?$' \
| sort -V \
| tail -n1)

# Start db
docker run -d --rm \
  -p 8000:8000 \
  --name ${CONTAINER_NAME} \
  surrealdb/surrealdb:${TAG} start --log debug --user test --pass test memory

echo "Waiting 5s for db to start..."
sleep 5

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
