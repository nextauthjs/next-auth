#!/usr/bin/env bash

CONTAINER_NAME=next-auth-typegoose-test

JEST_WATCH=false

# Is the watch flag passed to the script?
while getopts w flag; do
    case "${flag}" in
    w) JEST_WATCH=true ;;
    *) continue ;;
    esac
done

# Start db
another_container=false
docker run -d --rm -p 27017:27017 --name ${CONTAINER_NAME} mongo || another_container=true

if ! $another_container; then
    echo "Waiting 3 sec for db to start..."
    sleep 3
fi

if $JEST_WATCH; then
    # Run jest in watch mode
    NODE_ENV=test npx jest tests --bail --watch
else
    NODE_ENV=test npx jest --bail
fi

# Stop db
if ! $another_container; then
    docker stop ${CONTAINER_NAME} && echo "DB stopped"
fi
