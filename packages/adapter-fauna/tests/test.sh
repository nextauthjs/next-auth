#!/usr/bin/env bash

CONTAINER_NAME=next-auth-fauna-test
FAUNADB_PORT=8443
FAUNA_ADMIN_KEY=secret

# Start Docker
docker run -d --rm \
--name ${CONTAINER_NAME} \
-p ${FAUNADB_PORT}:${FAUNADB_PORT} \
fauna/faunadb

echo "Waiting 20 sec for db to start..."
sleep 20

# Create collections and indexes
npx fauna schema push --url=http://localhost:8443 --force --secret=${FAUNA_ADMIN_KEY}

# Always stop container, but exit with 1 when tests are failing
if npx jest;then
    docker stop ${CONTAINER_NAME}
else
    docker stop ${CONTAINER_NAME} && exit 1
fi
