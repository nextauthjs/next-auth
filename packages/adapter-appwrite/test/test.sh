#!/usr/bin/env bash

./test/setup.sh # Execute setup script
if [ $? -eq 0 ]; then
    if vitest run -c ../utils/vitest.config.ts; then
        docker compose -f ./appwrite/compose.yml down --volumes
    else
        docker compose -f ./appwrite/compose.yml down --volumes && exit 1
    fi
else
    docker compose -f ./appwrite/compose.yml down --volumes && exit 1
fi
