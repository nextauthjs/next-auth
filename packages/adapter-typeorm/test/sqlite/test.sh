#!/usr/bin/env bash
set -eu

rm -f test/sqlite/dev.db

echo "Started running SQLite tests with default models."
if vitest run -c ../utils/vitest.config.ts sqlite/index.test.ts; then
  rm -f db.sqlite
else
  rm -f db.sqlite && exit 1
fi
echo "Finished running SQLite tests with default models."

rm -f test/sqlite/dev.db

echo "Started running SQLite tests with custom models."
if CUSTOM_MODEL=1 vitest run -c ../utils/vitest.config.ts sqlite/index.custom.test.ts; then
  rm -f db.sqlite
else
  rm -f db.sqlite && exit 1
fi
echo "Finished running SQLite tests with custom models."

rm -f test/sqlite/dev.db
