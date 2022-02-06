#!/usr/bin/env bash

CONTAINER_NAME=next-auth-dgraph
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
-p 8000:8000 -p 8080:8080 \
--name "${CONTAINER_NAME}" \
dgraph/standalone

echo "Waiting 15 sec for db to start..." && sleep 15

head -n -1 src/graphql/schema.gql > tests/test.schema.gql
PUBLIC_KEY=$(sed 's/$/\\n/' tests/public.key | tr -d '\n')
echo "# Dgraph.Authorization {\"VerificationKey\":\"$PUBLIC_KEY\",\"Namespace\":\"https://dgraph.io/jwt/claims\",\"Header\":\"Authorization\",\"Algo\":\"RS256\"}" >> tests/test.schema.gql

curl -X POST localhost:8080/admin/schema --data-binary '@tests/test.schema.gql'

printf "\nWaiting 5 sec for schema to be uploaded..." && sleep 5

if $JEST_WATCH; then
    # Run jest in watch mode
    npx jest tests --watch
    # Only stop the container after jest has been quit
    docker stop "${CONTAINER_NAME}"
else
    # Always stop container, but exit with 1 when tests are failing
    if npx jest tests; then
        docker stop "${CONTAINER_NAME}"
    else
        docker stop "${CONTAINER_NAME}"
    fi
fi

rm tests/test.schema.gql