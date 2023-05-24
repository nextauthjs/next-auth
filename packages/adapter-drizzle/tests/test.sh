
#!/usr/bin/env bash

CONTAINER_NAME=next-auth-drizzle-mysql-test

# Start db
docker run -d --rm \
--name ${CONTAINER_NAME} \
-e MYSQL_ROOT_PASSWORD=my-secret-pw \
-d mysql:8

echo "Waiting 5 sec for db to start..."
sleep 5

# Create tables and indeces
npx drizzle-kit generate:mysql --schema=src/schema.ts --out=.drizzle

# Always stop container, but exit with 1 when tests are failing
# if npx jest;then
#     docker stop ${CONTAINER_NAME}
# else
#     docker stop ${CONTAINER_NAME} && exit 1
# fi
