#!/usr/bin/env bash

# ==============================================================================
# Initial Configuration
# ==============================================================================
CONTAINER_NAME="authjs-dgraph"
SCHEMA_FILE="src/lib/graphql/schema.gql"
HS512_KEY=$(<test/hs512.key)
CONTAINER_IMAGE="dgraph/standalone:latest"
PORT_8080="8080"
PORT_9080="9080"

# ==============================================================================
# Function Definitions
# ==============================================================================

# Generic function to wait for a specific condition to be met
function wait_for_condition {
    local command=$1
    local success_message=$2
    local fail_message=$3
    local max_attempts=${4:-30}
    local sleep_duration=${5:-2}

    echo "----------------------------------------"
    for ((i=1; i<=max_attempts; i++)); do
        if $command; then
            echo "${success_message}"
            # Interactive or non-interactive handling
            # [[ -t 0 ]] && read -p "Pausing, press any key to continue..."
            return 0
        else
            echo "${fail_message} attempt $i"
        fi
        sleep ${sleep_duration}
    done
    echo "${fail_message}: Condition not met after ${max_attempts} attempts."
    echo "----------------------------------------"
    return 1
}

# Checks if Dgraph server is up and accessible
function check_dgraph_ready {
    curl -sSf "http://localhost:${PORT_8080}/health" >/dev/null 2>&1
}

# Function to upload schema and check success
function upload_schema_and_check {
    local response=$(echo "${FINAL_SCHEMA}" | curl -s -w "%{http_code}" -o /tmp/dgraph_response.json -X POST "http://localhost:${PORT_8080}/admin/schema" --data-binary "@-")
    local http_code=$(echo "${response}" | tail -n1)  # Extract only the HTTP status code
    [[ "$http_code" -eq 200 ]]
}

# ==============================================================================
# Main Execution
# ==============================================================================

# Check and remove any existing container
if docker ps -a | grep -q "${CONTAINER_NAME}"; then
    echo "Stopping and removing existing container..."
    docker stop "${CONTAINER_NAME}"
    docker rm "${CONTAINER_NAME}"
fi

# Start the Dgraph container
echo "----------------------------------------"
echo "Starting Dgraph container..."
docker run -d --rm -p "${PORT_8080}:${PORT_8080}" -p "${PORT_9080}:${PORT_9080}" --name "${CONTAINER_NAME}" "${CONTAINER_IMAGE}"

# Wait for Dgraph to start
if ! wait_for_condition check_dgraph_ready "Dgraph is up!" "Dgraph not up..."; then
    echo "Dgraph failed to start."
    docker stop "${CONTAINER_NAME}"
    exit 1
fi

# Prepare the Dgraph schema without the last line
SCHEMA=$(sed '$ d' "${SCHEMA_FILE}")

# Append the Dgraph authorization header
FINAL_SCHEMA="${SCHEMA}
# Dgraph.Authorization {\"VerificationKey\":\"${HS512_KEY}\",\"Namespace\":\"https://dgraph.io/jwt/claims\",\"Header\":\"Authorization\",\"Algo\":\"HS512\"}"

# Proceed with uploading the schema to Dgraph, include proper handling for multiline JSON
if echo "${FINAL_SCHEMA}" | curl -s -w "%{http_code}" -o /tmp/dgraph_response.json -X POST "http://localhost:${PORT_8080}/admin/schema" --data-binary "@-"; then
    echo "Schema has been successfully uploaded."
else
    echo "Failed to upload schema."
    exit 1
fi

# Run tests
if vitest run -c "../utils/vitest.config.ts"; then
    echo "Tests passed."
else
    echo "Tests failed."
fi

# Always stop container after tests
echo "----------------------------------------"
echo "Stopping Dgraph container..."
docker stop "${CONTAINER_NAME}"