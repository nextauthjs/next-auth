#!/usr/bin/env bash

CONTAINER_NAME=authjs-azure-tables-test

# Start db
docker run -d --rm \
  -p 10002:10002 \
  --name ${CONTAINER_NAME} \
  mcr.microsoft.com/azure-storage/azurite azurite-table -l /workspace -d /workspace/debug.log --tableHost 0.0.0.0 --loose

echo "Waiting 10s for db to start..."
sleep 10

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
