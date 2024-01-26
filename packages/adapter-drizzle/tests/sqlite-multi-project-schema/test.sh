#!/usr/bin/env bash

set -eu


echo "Running SQLite tests."

rm -f db.sqlite

drizzle-kit generate:sqlite --config=./tests/sqlite/drizzle.config.ts
drizzle-kit push:sqlite --config=./tests/sqlite/drizzle.config.ts
vitest --config=../utils/vitest.config.ts --coverage ./tests/sqlite/index.test.ts