#!/usr/bin/env bash

CONTAINER_NAME=authjs-fauna-test
FAUNADB_PORT=8443
FAUNA_ADMIN_KEY=secret

# Start Docker
docker run -d --rm \
  --name ${CONTAINER_NAME} \
  -p ${FAUNADB_PORT}:${FAUNADB_PORT} \
  fauna/faunadb

echo "Waiting 15s for db to start..."
sleep 15

# Create collections and indexes
fauna schema push --url=http://localhost:8443 --force --secret=${FAUNA_ADMIN_KEY}

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
