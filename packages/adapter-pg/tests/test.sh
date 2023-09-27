#!/usr/bin/env bash

docker-compose up -d

echo "waiting 10 seconds for databases to start..."
sleep 10

# Always stop container, but exit with 1 when tests are failing
if npx jest tests; then
  docker stop pg-adapter
else
  docker stop pg-adapter && exit 1
fi
