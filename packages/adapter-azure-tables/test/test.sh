#!/usr/bin/env bash

CONTAINER_NAME=authjs-azure-tables-test

# Start db
docker run -d -p 10002:10002 --name ${CONTAINER_NAME} mcr.microsoft.com/azure-storage/azurite azurite-table -l /workspace -d /workspace/debug.log --tableHost 0.0.0.0 --loose

echo "Waiting 3 sec for db to start..."
sleep 3

# Always stop container, but exit with 1 when tests are failing
if vitest -c ../utils/vitest.config.ts;then
    docker stop ${CONTAINER_NAME}
else
    docker stop ${CONTAINER_NAME} && exit 1
fi
