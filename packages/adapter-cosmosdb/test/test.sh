#!/usr/bin/env bash

echo "starting cosmos script"

CONTAINER_NAME=authjs-azure-cosmosdb-test

# Start db
docker run \
    --publish 8081:8081 \
    --publish 10250-10255:10250-10255 \
    --name ${CONTAINER_NAME}  \
    --detach \
    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator:latest   

echo "Waiting for emulator to be available..."
# Define the IP address variable
ipAddress="localhost"

# Define the timeout in seconds
timeout_seconds=500  # Adjust as needed

# Get the start time
start_time=$(date +%s)

# Start a loop
while true; do
    # Get the current time
    current_time=$(date +%s)

    # Calculate the elapsed time
    elapsed_time=$((current_time - start_time))

    # Print remaining time
    remaining_time=$((timeout_seconds - elapsed_time))
    echo "Remaining time: $remaining_time seconds"

    # Check if the timeout is reached
    if [ $elapsed_time -ge $timeout_seconds ]; then
        echo "Timeout reached. Exiting..."
        break
    fi

    # Sleep for 2 seconds
    sleep 30

    # Define the command
    command="curl -s -k \"https://${ipAddress}:8081/_explorer/emulator.pem\""

    # Print the command
    echo "$command"

    # Execute the command and store the result
    resultCommand=$(eval "$command")

    # Check the exit status of the curl command
    if [ $? -ne 0 ]; then
        echo "Curl command failed. Retrying..."
        continue
    fi

    echo "Emulator Started successfully."
    break

done


TESTMODE=NOPK
if vitest run -c ../utils/vitest.config.ts; then
  echo "Executed test with no partition key definition"
else
  docker stop ${CONTAINER_NAME} && exit 1
fi

TESTMODE=ID

if vitest run -c ../utils/vitest.config.ts; then
  echo "Executed test with same as id partition key strategy"
else
  docker stop ${CONTAINER_NAME} && exit 1
fi

TESTMODE=DT

if vitest run -c ../utils/vitest.config.ts; then
  echo "Executed test with same as id dataType strategy"
else
  docker stop ${CONTAINER_NAME} && exit 1
fi

TESTMODE=HC

# Always stop container, but exit with 1 when tests are failing
if vitest run -c ../utils/vitest.config.ts; then
  echo "Executed test with hardcoded partition key strategy"
  docker stop ${CONTAINER_NAME}
else
  docker stop ${CONTAINER_NAME} && exit 1
fi
