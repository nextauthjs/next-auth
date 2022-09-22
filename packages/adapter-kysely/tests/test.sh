#!/usr/bin/env bash

docker-compose up -d
echo "waiting 10 seconds for databases to start..."
sleep 10
npx jest
docker-compose down
