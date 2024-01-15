#!/usr/bin/env bash

set -eu


echo "Running SQLite tests."

rm -f db.sqlite

drizzle-kit generate:sqlite --config=./tests/sqlite/drizzle.config.ts
drizzle-kit push:sqlite --config=./tests/sqlite/drizzle.config.ts
jest ./tests/sqlite/index.test.ts --forceExit

echo "Running LibSQL tests."

rm -f db.sqlite

drizzle-kit generate:sqlite --config=./tests/sqlite/drizzle.config.ts
drizzle-kit push:sqlite --config=./tests/sqlite/drizzle.config.ts
jest ./tests/sqlite/libsql.test.ts --forceExit
