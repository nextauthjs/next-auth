#!/usr/bin/env bash

set -eu

rm -f db.sqlite

drizzle-kit generate:sqlite --config=./tests/sqlite/zero-config/drizzle.config.ts
drizzle-kit push:sqlite --config=./tests/sqlite/zero-config/drizzle.config.ts
jest ./tests/sqlite/zero-config/index.test.ts --forceExit

# rm -f db.sqlite

# drizzle-kit generate:sqlite --config=./tests/sqlite/custom/drizzle.config.ts
# drizzle-kit push:sqlite --config=./tests/sqlite/custom/drizzle.config.ts
# jest ./tests/sqlite/custom/index.test.ts --forceExit