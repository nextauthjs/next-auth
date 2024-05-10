#!/usr/bin/env bash

# install Supabase CLI when run on CI
# if [ "$CI" = true ]; then
#   wget -q -O supabase.deb https://github.com/supabase/cli/releases/download/v1.91.1/supabase_1.91.1_linux_amd64.deb
#   sudo dpkg -i supabase.deb
# fi

# Start Supabase, grep key and set it as SUPABASE_SERVICE_ROLE_KEY environment variable
# line=$(supabase start | grep 'service_role key')
# IFS=':'
# arr=("$line")
# unset IFS
# export SUPABASE_SERVICE_ROLE_KEY=${arr[1]}

# Start database and apply migrations
pnpm exec supabase db start

echo "Waiting 15s for db to start..." && sleep 15

# Always stop Supabase, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  # docker rm -f supabase_db_nextauth
  docker stop supabase_db_nextauth
else
  # docker rm -f supabase_db_nextauth && exit 1
  docker stop supabase_db_nextauth && exit 1
fi
