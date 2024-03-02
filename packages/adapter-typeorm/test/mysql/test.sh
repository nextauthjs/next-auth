#!/usr/bin/env bash

WAIT=20
echo "Waiting ${WAIT} sec for MySQL db to be up..."
sleep ${WAIT}

set -eu

echo "Started running MySQL tests with default models."
vitest run -c ../utils/vitest.config.ts mysql/index.test.ts
echo "Finished running MySQL tests with default models."

echo "Started running MySQL tests with custom models."
CUSTOM_MODEL=1 vitest run -c ../utils/vitest.config.ts mysql/index.custom.test.ts
echo "Finished running MySQL tests with custom models."
