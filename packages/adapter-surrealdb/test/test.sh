#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME=authjs-surrealdb-test

# The surrealdb JS client 1.3.x pairs with a v2.x server; the v2 tag tracks the latest v2 release.
docker run -d --rm \
  -p 8000:8000 \
  --name ${CONTAINER_NAME} \
  surrealdb/surrealdb:v2 start --log debug --user test --pass test memory

trap 'docker stop ${CONTAINER_NAME} >/dev/null 2>&1 || true' EXIT

echo "Waiting for SurrealDB to become ready..."
for _ in $(seq 1 30); do
  if curl -sf http://127.0.0.1:8000/health >/dev/null; then
    echo "SurrealDB is ready."
    break
  fi
  sleep 1
done

vitest run -c ../utils/vitest.config.ts
