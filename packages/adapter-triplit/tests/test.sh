#!/usr/bin/env bash

# Start the server in the background
pnpm exec triplit dev &
SERVER_PID=$!

# Optional: Wait for the server to be ready
sleep 2

# Run migration
pnpm exec triplit migrate up --token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ4LXRyaXBsaXQtdG9rZW4tdHlwZSI6InNlY3JldCIsIngtdHJpcGxpdC1wcm9qZWN0LWlkIjoibG9jYWwtcHJvamVjdC1pZCJ9.8Z76XXPc9esdlZb2b7NDC7IVajNXKc4eVcPsO7Ve0ug

# Run tests
npx jest --config=./tests/jest.config.js

# Kill the server
kill $SERVER_PID


