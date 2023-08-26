#!/usr/bin/env bash

WAIT=20
echo "Waiting ${WAIT} sec for MySQL db to be up..."
sleep ${WAIT}

set -eu

echo "Started running MySQL tests with default models."
jest tests/mysql/index.test.ts
echo "Finished running MySQL tests with default models."

echo "Started running MySQL tests with custom models."
CUSTOM_MODEL=1 jest tests/mysql/index.custom.test.ts
echo "Finished running MySQL tests with custom models."
