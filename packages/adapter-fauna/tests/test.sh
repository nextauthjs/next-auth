#!/usr/bin/env bash

CONTAINER_NAME=next-auth-fauna-test
export FAUNADB_PORT=8443
export FAUNA_ADMIN_KEY=secret
export FAUNADB_DOMAIN=localhost
export FAUNADB_SCHEME=http


# Start db
docker run -d --rm \
--name ${CONTAINER_NAME} \
-p ${FAUNADB_PORT}:${FAUNADB_PORT} \
fauna/faunadb

echo "Waiting 20 sec for db to start..."
sleep 20

# Create tables and indeces
# NOTE: None of this will work now because we've changed the way schemas are generated and
# fauna-schema-migrator isn't compatible with v10
npx fauna-schema-migrate generate
npx fauna-schema-migrate apply all

# Always stop container, but exit with 1 when tests are failing
if npx jest;then
    docker stop ${CONTAINER_NAME}
else
    docker stop ${CONTAINER_NAME} && exit 1
fi
