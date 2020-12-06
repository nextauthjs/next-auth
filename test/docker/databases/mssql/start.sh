#!/usr/bin/env sh
# launch setup on the background & start server
# otherise sqlservr won't start
/var/setup/setup.sh & /opt/mssql/bin/sqlservr