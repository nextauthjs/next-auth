#!/usr/bin/env bash

set -eu

echo "Running SQLite tests."

rm -f db.sqlite

drizzle-kit generate --config=./test/sqlite-multi-project-schema/drizzle.config.ts
drizzle-kit migrate --config=./test/sqlite-multi-project-schema/drizzle.config.ts

if vitest run -c ../utils/vitest.config.ts ./test/sqlite-multi-project-schema/index.test.ts; then
  rm -f db.sqlite
else
  rm -f db.sqlite && exit 1
fi
