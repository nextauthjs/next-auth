#!/usr/bin/env bash

# Start database and apply migrations
pnpm exec supabase start

printf "\nWaiting 10s for db to start..." && sleep 10

# Always stop Supabase, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  pnpm exec supabase stop --no-backup
else
  pnpm exec supabase stop --no-backup && exit 1
fi
