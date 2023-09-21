#! /usr/bin/env bash
#
# Run parallel commands and fail if any of them fails.
# shellcheck disable=SC2046
# Based on: https://gist.github.com/mjambon/79adfc5cf6b11252e78b75df50793f24#gistcomment-3861511

set -eu

pids=()

./tests/init.sh

./tests/sqlite/test.sh & pids+=($!)

./tests/postgresql/test.sh & pids+=($!)

./tests/mysql/test.sh & pids+=($!)

for _ in "${pids[@]}"; do
    if wait -n; then
        :
    else
        status=$?
        echo "One of the subprocesses exited with nonzero status $status. Aborting."
        for pid in "${pids[@]}"; do
            # Send a termination signal to all the children, and ignore errors
            # due to children that no longer exist.
            kill "$pid" 2> /dev/null || :
        done
        docker kill $(docker ps -q)
        exit "$status"
    fi
done

docker kill $(docker ps -q)
