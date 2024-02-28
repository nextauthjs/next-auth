#!/usr/bin/env bash

# Easier to read `docker-compose up` output
# export BUILDKIT_PROGRESS=plain

args=("-f" "docker-compose.yml")
if [[ -z "${CI}" ]]; then
  args+=("--env-file" ".env")
fi
args+=("up" "--detach" "--build")

echo "Running: docker-compose ${args[*]}"

if ! docker-compose "${args[@]}"; then
  echo "Failed to start container"
  exit 1
fi

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
