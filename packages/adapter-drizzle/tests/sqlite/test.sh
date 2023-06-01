#!/usr/bin/env bash

set -eu

rm -f tests/sqlite/dev.db

echo "Started running SQLite tests."
jest ./tests/sqlite/index.test.ts
echo "Finished running SQLite tests."