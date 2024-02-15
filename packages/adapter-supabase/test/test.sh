#!/usr/bin/env bash

# install Supabase CLI when run on CI
if [ "$CI" = true ]; then
	wget -q -O supabase.deb https://github.com/supabase/cli/releases/download/v1.91.1/supabase_1.91.1_linux_amd64.deb
	sudo dpkg -i supabase.deb
fi

# Start Supabase, grep key and set it as SUPABASE_SERVICE_ROLE_KEY environment variable
line=$(supabase start | grep 'service_role key')
IFS=':'; arr=("$line"); unset IFS;
export SUPABASE_SERVICE_ROLE_KEY=${arr[1]}

# Always stop Supabase, but exit with 1 when tests are failing
if vitest -c ../utils/vitest.config.ts; then
	supabase stop
else
	supabase stop && exit 1
fi

