#!/usr/bin/env bash

set -eu

echo "Running SQLite tests."

rm -f db.sqlite

# Push schema and seed
NODE_OPTIONS='--import tsx' drizzle-kit generate:sqlite --config=./test/sqlite/drizzle.config.ts
NODE_OPTIONS='--import tsx' drizzle-kit push:sqlite --config=./test/sqlite/drizzle.config.ts

if vitest run -c ../utils/vitest.config.ts ./test/sqlite/index.test.ts; then
  rm -f db.sqlite
else
  rm -f db.sqlite && exit 1
fi
