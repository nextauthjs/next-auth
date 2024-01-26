#!/usr/bin/env bash

CONTAINER_NAME=authjs-mongodb-test

# Start db
docker run -d --rm -p 27017:27017 --name ${CONTAINER_NAME} mongo

echo "Waiting 3 sec for db to start..."
sleep 3

# Always stop container, but exit with 1 when tests are failing
if vitest -c ../utils/vitest.config.ts;then
    docker stop ${CONTAINER_NAME}
else
    docker stop ${CONTAINER_NAME} && exit 1
fi