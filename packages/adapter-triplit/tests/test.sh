#!/usr/bin/env bash

# Start the server in the background
pnpm exec triplit dev &
SERVER_PID=$!

# Optional: Wait for the server to be ready
sleep 2

# Run tests
# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  kill $SERVER_PID
else
  kill $SERVER_PID && exit 1
fi
