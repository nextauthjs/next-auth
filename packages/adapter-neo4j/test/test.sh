#!/usr/bin/env bash

NEO4J_USER=neo4j
NEO4J_PASS=password
CONTAINER_NAME=authjs-neo4j-test

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

echo "Waiting 5s for db to start..." && sleep 5

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  docker stop "${CONTAINER_NAME}"
else
  docker stop "${CONTAINER_NAME}" && exit 1
fi
