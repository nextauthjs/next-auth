#!/usr/bin/env bash

# Start Hasura
docker-compose up -d

echo "Waiting 60 sec for db to start..."
sleep 60

# Always stop container, but exit with 1 when tests are failing
if npx jest;then
    docker-compose down --rmi -v
else
    docker-compose down --rmi -v && exit 1
fi
