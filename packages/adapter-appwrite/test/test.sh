#!/usr/bin/env bash

# Start self-hosted appwrite instance
docker compose up -d

if [ $? -eq 0 ]; then
    echo STARTED APPWRITE INSTANCE SUCCESSFULLY
    # docker exec appwrite-mariadb "chmod u+x /var/container.sh"
else
    echo FAILED TO START APPWRITE INSTANCE
fi