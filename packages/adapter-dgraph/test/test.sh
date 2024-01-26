#!/usr/bin/env bash

CONTAINER_NAME=authjs-dgraph

# Start db

docker run -d --rm \
-p 8000:8000 -p 8080:8080 \
--name "${CONTAINER_NAME}" \
dgraph/standalone

echo "Waiting 15 sec for db to start..." && sleep 15

head -n -1 src/lib/graphql/schema.gql > test/test.schema.gql
PUBLIC_KEY=$(sed 's/$/\\n/' test/public.key | tr -d '\n')
echo "# Dgraph.Authorization {\"VerificationKey\":\"$PUBLIC_KEY\",\"Namespace\":\"https://dgraph.io/jwt/claims\",\"Header\":\"Authorization\",\"Algo\":\"RS256\"}" >> test/test.schema.gql

curl -X POST localhost:8080/admin/schema --data-binary '@test/test.schema.gql'

printf "\nWaiting 5 sec for schema to be uploaded..." && sleep 5


# Always stop container, but exit with 1 when tests are failing
if vitest -c ../utils/vitest.config.ts; then
    docker stop "${CONTAINER_NAME}"
else
    docker stop "${CONTAINER_NAME}"
fi

rm test/test.schema.gql