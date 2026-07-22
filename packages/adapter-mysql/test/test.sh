CONTAINER_NAME=authjs-mysql-test

docker run -d --rm\
  --name ${CONTAINER_NAME} \
  -e MYSQL_ROOT_PASSWORD=mysql \
  -e MYSQL_DATABASE=mysql_database\
  -p 3333:3306\
  -v "$(pwd)"/schema.sql:/docker-entrypoint-initdb.d/schema.sql \
  mysql:latest
echo "waiting 10s for db to start..."
sleep 20
# Always stop container, but exit with 1 when tests are failing
if vitest run -c ./utils/vitest.config.ts; 
# https://docs.docker.com/
then
docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi