#!/usr/bin/env bash

docker run -d --platform linux/x86_64 -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=adapter-knexjs -e MYSQL_USER=admin -e MYSQL_PASSWORD=secret -p 3306:3306 -v "$(pwd)"/schema.sql:/docker-entrypoint-initdb.d/schema.sql mysql:latest
echo "waiting 10 seconds for databases to start..."
sleep 10

# Always stop container, but exit with 1 when tests are failing
if npx jest tests; then
  docker stop knexjs-adapter
else
  docker stop knexjs-adapter && exit 1
fi
