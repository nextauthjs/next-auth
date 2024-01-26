#!/usr/bin/env bash

docker run -d \
  --name mysql \
  --rm \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=kysely_test \
  -p 3308:3306 \
  -v "$(pwd)"/test/scripts/mysql-init.sql:/data/application/init.sql \
  mysql/mysql-server \
  --init-file /data/application/init.sql

docker run -d \
  --name postgres \
  --rm \
  -e POSTGRES_DB=kysely_test \
  -e POSTGRES_USER=kysely \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -p 5434:5432 \
  postgres
  
echo "waiting 15 seconds for databases to start..."
sleep 15

# Always stop container, but exit with 1 when tests are failing
if vitest -c ../utils/vitest.config.ts; then
  docker stop mysql && docker stop postgres
else
  docker stop mysql && docker stop postgres && exit 1
fi
