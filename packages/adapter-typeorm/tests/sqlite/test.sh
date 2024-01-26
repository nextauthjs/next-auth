#!/usr/bin/env bash

set -eu

rm -f test/sqlite/dev.db

echo "Started running SQLite tests with default models."
vitest -c ../utils/vitest.config.ts sqlite/index.test.ts
echo "Finished running SQLite tests with default models."

rm -f test/sqlite/dev.db

echo "Started running SQLite tests with custom models."
CUSTOM_MODEL=1 vitest -c ../utils/vitest.config.ts sqlite/index.custom.test.ts
echo "Finished running SQLite tests with custom models."
