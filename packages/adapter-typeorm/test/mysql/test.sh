#!/usr/bin/env bash
set -eu

# Init MySQL container
echo "Initializing container for MySQL tests"

MYSQL_DATABASE=next-auth
MYSQL_ROOT_PASSWORD=password
MYSQL_CONTAINER_NAME=next-auth-mysql-test

function startDatabase {
  docker run -d --rm \
    -e MYSQL_DATABASE=${MYSQL_DATABASE} \
    -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} \
    --name "${MYSQL_CONTAINER_NAME}" \
    -p 3306:3306 \
    mysql:8 --default-authentication-plugin=mysql_native_password

  echo "Waiting 5s for db to start..."
  sleep 5
}

startDatabase
echo "Started running MySQL tests with default models."
if vitest run -c ../utils/vitest.config.ts mysql/index.test.ts; then
  docker stop ${MYSQL_CONTAINER_NAME}
else
  docker stop ${MYSQL_CONTAINER_NAME} && exit 1
fi
echo "Finished running MySQL tests with default models."

startDatabase
echo "Started running MySQL tests with custom models."
if CUSTOM_MODEL=1 vitest run -c ../utils/vitest.config.ts mysql/index.custom.test.ts; then
  docker stop ${MYSQL_CONTAINER_NAME}
else
  docker stop ${MYSQL_CONTAINER_NAME} && exit 1
fi
echo "Finished running MySQL tests with custom models."
