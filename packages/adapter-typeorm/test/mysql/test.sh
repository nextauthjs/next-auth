#!/usr/bin/env bash
set -eu

echo "Waiting 5s for db to start..."
sleep 5

echo "Started running MySQL tests with default models."
vitest run -c ../utils/vitest.config.ts mysql/index.test.ts
echo "Finished running MySQL tests with default models."

echo "Started running MySQL tests with custom models."
CUSTOM_MODEL=1 vitest run -c ../utils/vitest.config.ts mysql/index.custom.test.ts
echo "Finished running MySQL tests with custom models."
