#!/usr/bin/env bash

cd ../../apps/examples/nextjs/ || exit

docker-compose -f docker-compose.yml \
  --progress=plain \
  --env-file ../../../packages/core/.env \
  up \
  --detach \
  --build

echo "waiting 10 seconds for container to start..."
sleep 10

# Used to control which env vars to load in the playwright process
export TEST_DOCKER=1

# Always stop container, but exit with 1 when tests are failing
if playwright test -c ../../../packages/utils/playwright.config.ts; then
  docker-compose down
else
  docker-compose down && exit 1
fi
