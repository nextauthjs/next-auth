#!/usr/bin/env bash

CONTAINER_NAME=next-auth-mongodb-test

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
docker run -d --rm -p 27017:27017 --name ${CONTAINER_NAME} "prismagraphql/mongo-single-replica:4.4.3-bionic"

yarn prisma generate --schema ./prisma/mongodb.prisma

if $JEST_WATCH; then
    # Run jest in watch mode
    npx jest --watch
    # Only stop the container after jest has been quit
    docker stop "${CONTAINER_NAME}"
else
    # Always stop container, but exit with 1 when tests are failing
    if CONTAINER_NAME=${CONTAINER_NAME} npx jest;then
        docker stop ${CONTAINER_NAME}
    else
        docker stop ${CONTAINER_NAME} && exit 1
    fi
fi