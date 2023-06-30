#!/usr/bin/env bash

set -eu

rm -f tests/sqlite/dev.db


drizzle-kit generate:sqlite --config=./src/sqlite/drizzle.config.ts
drizzle-kit push:sqlite --config=./src/sqlite/drizzle.config.ts

echo "Started running SQLite tests."
jest ./tests/sqlite/zero-config.test.ts --forceExit
echo "Finished running SQLite tests."

echo "Started running SQLite tests with custom models."
jest ./tests/sqlite/custom.test.ts --forceExit
echo "Finished running SQLite tests with custom models."
