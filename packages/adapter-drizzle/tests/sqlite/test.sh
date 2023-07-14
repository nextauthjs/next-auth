#!/usr/bin/env bash

set -eu

rm -f db.sqlite

drizzle-kit generate:sqlite --config=./tests/sqlite/zero-config/drizzle.config.ts
drizzle-kit push:sqlite --config=./tests/sqlite/zero-config/drizzle.config.ts

echo "Started running SQLite tests."
jest ./tests/sqlite/zero-config/index.test.ts --forceExit
echo "Finished running SQLite tests."
