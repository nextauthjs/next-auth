#!/usr/bin/env bash

set -eu

echo "Running SQLite tests."

rm -f db.sqlite

# Push schema and seed
drizzle-kit generate:sqlite --config=./test/sqlite-multi-project-schema/drizzle.config.ts
NODE_OPTIONS='--import tsx'
tsx ./test/sqlite-multi-project-schema/migrator.ts

if vitest run -c ../utils/vitest.config.ts ./test/sqlite-multi-project-schema/index.test.ts; then
  rm -f db.sqlite
else
  rm -f db.sqlite && exit 1
fi
