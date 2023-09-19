#!/usr/bin/env bash

# Start Hasura
docker-compose up -d

echo "Waiting 20 sec for db to start..."
sleep 20

# Always stop container, but exit with 1 when tests are failing
if npx jest;then
    docker compose down --rmi all -v
else
    docker compose down --rmi all -v && exit 1
fi
