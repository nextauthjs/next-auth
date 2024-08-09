#!/usr/bin/env bash

cleanup_and_exit() {
    docker compose -f ./appwrite/compose.yml down --volumes
    exit $1
}

./test/base-setup.sh
if [ $? -ne 0 ]; then
    cleanup_and_exit 1
fi

# Run tests
source .env && vitest run -c ../utils/vitest.config.ts
if [ $? -ne 0 ]; then
    cleanup_and_exit 1
fi

cleanup_and_exit 0
