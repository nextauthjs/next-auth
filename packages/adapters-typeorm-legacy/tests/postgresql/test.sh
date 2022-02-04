#!/usr/bin/env bash

WAIT=10
echo "Waiting ${WAIT} sec for PostgreSQL db to be up..."
sleep ${WAIT}

set -eu

echo "Started running PostgreSQL tests with default models."
jest tests/postgresql/index.test.ts
echo "Finished running PostgreSQL tests with default models."

echo "Started running PostgreSQL tests with custom models."
CUSTOM_MODEL=1 jest tests/postgresql/index.custom.test.ts
echo "Finished running PostgreSQL tests with custom models."
