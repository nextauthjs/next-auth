#!/usr/bin/env bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
NEO4J_USER=neo4j
NEO4J_PASS=password
CONTAINER_NAME=next-auth-neo4j-test-e
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
docker run -d --rm \
-e NEO4J_AUTH=${NEO4J_USER}/${NEO4J_PASS} \
-e TEST_NEO4J_USER=${NEO4J_USER} \
-e TEST_NEO4J_PASS=${NEO4J_PASS} \
--name "${CONTAINER_NAME}" \
-p7474:7474 -p7687:7687 \
neo4j:4.2.0

# For debug or testing it may be useful to use neo4j enterprise edition.
# Use the lines below in the docker run statement.
# -e NEO4J_ACCEPT_LICENSE_AGREEMENT=yes \
# neo4j:4.2.0-enterprise

echo "Waiting 5 sec for db to start..." && sleep 5

if $JEST_WATCH; then
    # Run jest in watch mode
    npx jest tests --watch
    # Only stop the container after jest has been quit
    docker stop "${CONTAINER_NAME}"
else
    # Always stop container, but exit with 1 when tests are failing
    if npx jest tests --detectOpenHandles --forceExit;then
        docker stop "${CONTAINER_NAME}"
    else
        docker stop "${CONTAINER_NAME}" && exit 1
    fi
fi
