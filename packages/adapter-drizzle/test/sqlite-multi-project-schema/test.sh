#!/usr/bin/env bash

set -eu


echo "Running SQLite tests."

rm -f db.sqlite

drizzle-kit generate:sqlite --config=./test/sqlite/drizzle.config.ts
drizzle-kit push:sqlite --config=./test/sqlite/drizzle.config.ts
vitest -c ../utils/vitest.config.ts ./test/sqlite/index.test.ts