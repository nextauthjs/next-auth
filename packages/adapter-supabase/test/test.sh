#!/usr/bin/env bash

# Start Supabase, grep key and set it as SUPABASE_SERVICE_ROLE_KEY environment variable
# line=$(pnpm exec supabase start | grep 'service_role key')
# IFS=':'
# arr=("$line")
# unset IFS
# export SUPABASE_SERVICE_ROLE_KEY=${arr[1]}
#
# echo "LINE $line"
# echo "SUPABASE_KEY $SUPABASE_SERVICE_ROLE_KEY"

# Start database and apply migrations
pnpm exec supabase start

echo "Waiting 15s for db to start..." && sleep 15

# Always stop Supabase, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  # docker rm -f supabase_db_nextauth
  pnpm exec supabase stop --no-backup
  # docker stop supabase_db_nextauth
else
  # docker rm -f supabase_db_nextauth && exit 1
  pnpm exec supabase stop --no-backup
  # docker stop supabase_db_nextauth && exit 1
fi
