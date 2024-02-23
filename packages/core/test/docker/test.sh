#!/usr/bin/env bash

cd ../../apps/examples/nextjs/ || exit

docker-compose -f docker-compose.yml \
  --progress=plain \
  up \
  --detach \
  --build

echo "waiting 10 seconds for container to start..."
sleep 10

export DEBUG=pw:webserver

# Always stop container, but exit with 1 when tests are failing
if pnpm dlx playwright test -c ../../../packages/utils/playwright.config.ts; then
  docker-compose down
else
  docker-compose down && exit 1
fi
