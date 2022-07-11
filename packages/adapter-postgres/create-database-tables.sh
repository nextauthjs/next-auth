#!/usr/bin/env bash
set -e

echo "Dropping DB adapter-postgres-test..."
dropdb adapter-postgres-test  --if-exists
echo "Creating DB adapter-postgres-test..."
createdb adapter-postgres-test

echo "Creating tables in example-schema.sql..."
psql -d adapter-postgres-test -a -f ./example-schema.sql

echo "Done."