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

export TEST_DOCKER=1

# Always stop container, but exit with 1 when tests are failing
if playwright test -c ../../../packages/utils/playwright.config.ts; then
  # docker-compose down
  echo "Tests passed"
else
  # docker-compose down && exit 1
  exit 1
fi
