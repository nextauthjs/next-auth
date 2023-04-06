
#!/usr/bin/env bash

CONTAINER_NAME=next-auth-drizzle-pg-test
export POSTGRES_PASSWORD=mysecretpassword


# Start db
docker run -d --rm \
--name ${CONTAINER_NAME} \
-e POSTGRES_PASSWORD=mysecretpassword \
-d postgres

echo "Waiting 20 sec for db to start..."
sleep 20

# Create tables and indeces
npx drizzle-kit generate:sqlite --schema=src/schema.ts --breakpoints

# Always stop container, but exit with 1 when tests are failing
if npx jest;then
    docker stop ${CONTAINER_NAME}
else
    docker stop ${CONTAINER_NAME} && exit 1
fi
