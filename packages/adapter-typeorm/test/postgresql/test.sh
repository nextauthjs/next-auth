#!/usr/bin/env bash
set -eu

echo "Waiting 5s for db to start..."
sleep 5

echo "Started running PostgreSQL tests with default models."
vitest run -c ../utils/vitest.config.ts postgresql/index.test.ts
echo "Finished running PostgreSQL tests with default models."

echo "Started running PostgreSQL tests with custom models."
CUSTOM_MODEL=1 vitest run -c ../utils/vitest.config.ts postgresql/index.custom.test.ts
echo "Finished running PostgreSQL tests with custom models."
