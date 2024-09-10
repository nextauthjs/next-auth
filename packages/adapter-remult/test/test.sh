#!/usr/bin/env bash

CONTAINER_NAME=authjs-remult-test
docker run -d --rm --name ${CONTAINER_NAME} 
  
# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi