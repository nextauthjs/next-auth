#!/usr/bin/env bash

docker-compose up -d
echo "waiting 15 seconds for databases to start..."
sleep 15
npx jest
docker-compose down
