#!/usr/bin/env bash

# Start Hasura
docker compose up -d

echo "Waiting 5 sec for Hasura to start..."
sleep 5

# Always stop container, but exit with 1 when tests are failing
if npx jest;then
    docker compose down -v
else
    docker compose down -v && exit 1
fi
