#!/usr/bin/env bash

set -eu


echo "Running SQLite tests."

rm -f db.sqlite

NODE_OPTIONS='--import tsx' drizzle-kit generate:sqlite --config=./test/sqlite/drizzle.config.ts
NODE_OPTIONS='--import tsx' drizzle-kit push:sqlite --config=./test/sqlite/drizzle.config.ts
vitest -c ../utils/vitest.config.ts ./test/sqlite/index.test.ts