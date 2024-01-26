#!/usr/bin/env bash

PGUSER=pgjs
PGPASSWORD=pgjs
HOSTPORT=6432
PGCONTAINER=postgresjs-adapter-test

docker run -d --rm \
  --name ${PGCONTAINER} \
  -e POSTGRES_USER=${PGUSER} \
  -e POSTGRES_PASSWORD=${PGPASSWORD} \
  -e POSTGRES_DB=db \
  -p ${HOSTPORT}:5432 \
  -v "$(pwd)"/setup.sql:/docker-entrypoint-initdb.d/setup.sql \
  postgres:13.3


echo "waiting 15 seconds for databases to start..."
sleep 15

# Always stop container, but exit with 1 when tests are failing
if npx jest tests; then
  docker stop ${PGCONTAINER}
else
  docker stop ${PGCONTAINER} && exit 1
fi
