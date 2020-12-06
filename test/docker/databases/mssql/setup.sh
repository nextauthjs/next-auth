#!/usr/bin/env sh
# see https://github.com/Microsoft/mssql-docker
# no way to know when sql server is ready
until /opt/mssql-tools/bin/sqlcmd -S 127.0.01 -U sa -P Pa55w0rd -d master -i /var/setup/setup.sql
do sleep 1;
done
echo "NEXT_AUTH: setup completed"