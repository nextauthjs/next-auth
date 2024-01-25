#!/usr/bin/env bash

CONTAINER_NAME=next-auth-azure-tables-test

JEST_WATCH=false

# Is the watch flag passed to the script?
while getopts w flag
do
    case "${flag}" in
        w) JEST_WATCH=true;;
        *) continue;;
    esac
done

# Start db
docker run -d -p 10002:10002 --name ${CONTAINER_NAME} mcr.microsoft.com/azure-storage/azurite azurite-table -l /workspace -d /workspace/debug.log --tableHost 0.0.0.0 --loose

echo "Waiting 3 sec for db to start..."
sleep 3

if $JEST_WATCH; then
    # Run jest in watch mode
    npx jest tests --watch
    # Only stop the container after jest has been quit
    docker stop "${CONTAINER_NAME}"
else
    # Always stop container, but exit with 1 when tests are failing
    if npx jest;then
        docker stop ${CONTAINER_NAME}
    else
        docker stop ${CONTAINER_NAME} && exit 1
    fi
fi
