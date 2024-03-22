#!/usr/bin/env bash

CONTAINER_NAME=authjs-firestore-test

# Start Docker
docker run -d --rm \
  --name ${CONTAINER_NAME} \
  -p 8080:8080 \
  -v "$(pwd)/test/firestore.rules":/firestore.rules \
  google/cloud-sdk:latest gcloud beta emulators firestore start \
  --host-port=0.0.0.0:8080 \
  --rules=/firestore.rules

echo "Waiting 5s for db to start..."
sleep 5

export FIRESTORE_EMULATOR_HOST=0.0.0.0:8080
# Always stop container, but exit with 1 when tests are failing
if pnpm exec vitest run -c ../utils/vitest.config.ts; then
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
