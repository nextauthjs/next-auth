if [ -f .env ]; then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
fi

execute_curl() {
    local http_status=$(curl --write-out %{http_code} --silent --output /dev/null "$@")
    echo "$http_status"
}
docker compose -f ./appwrite/compose.yml up -d

if [ $? -eq 0 ]; then
    echo Starting Appwrite server...
    sleep 40
    echo Appwrite server has started successfully

    # SETUP ACCOUNT, SESSION, TEAM, PROJECT, API_KEY
    # CREATE ACCOUNT
    echo "Creating account"
    http_status=$(execute_curl --location "${ENDPOINT}/account" \
        --header 'Content-Type: application/json' \
        --data-raw '{
        "userId": "'$ACCOUNT_ID'",
        "email": "'$ACCOUNT_EMAIL'",
        "password": "'$ACCOUNT_PASSWORD'",
        "name": "'$ACCOUNT_NAME'"
    }')
    if [ "$http_status" -eq 201 ]; then
        # CREATE SESSION
        echo "Account created successfully "
        echo "Creating session"

        http_status=$(execute_curl -c /tmp/appwrite_adapter_session.txt \
            --location "${ENDPOINT}/account/sessions/email" \
            --header 'Content-Type: application/json' \
            --data-raw '{
            "email": "'$ACCOUNT_EMAIL'",
            "password": "'$ACCOUNT_PASSWORD'"
        }')

        if [ "$http_status" -eq 201 ]; then
            # CREATE TEAM
            echo "Session created successfully"
            echo "Creating team"

            http_status=$(execute_curl -b /tmp/appwrite_adapter_session.txt \
                --location "${ENDPOINT}/teams" \
                --header 'Content-Type: application/json' \
                --data-raw '{
                "teamId": "'$TEAM_ID'",
                "name": "'$TEAM_NAME'"
            }')

            if [ "$http_status" -eq 201 ]; then
                # CREATE PROJECT
                echo "Team created successfully"
                echo "Creating project"

                http_status=$(execute_curl -b /tmp/appwrite_adapter_session.txt \
                    --location "${ENDPOINT}/projects" \
                    --header 'Content-Type: application/json' \
                    --data-raw '{
                    "projectId": "'$PROJECT_ID'",
                    "name": "'$PROJECT_NAME'",
                    "teamId": "'$TEAM_ID'",
                    "region": "default"
                }')

                if [ "$http_status" -eq 201 ]; then
                    # CREATE API KEY
                    echo "Project created successfully"
                    echo "Creating API Key Secret"

                    response=$(curl -b /tmp/appwrite_adapter_session.txt \
                        --location "${ENDPOINT}/projects/${PROJECT_ID}/keys" \
                        --header 'Content-Type: application/json' \
                        --data-raw '{
                        "name": "some key",
                        "scopes": [
                            "users.read",
                            "users.write",
                            "teams.read",
                            "teams.write",
                            "databases.read",
                            "databases.write",
                            "collections.read",
                            "collections.write",
                            "attributes.read",
                            "attributes.write",
                            "indexes.read",
                            "indexes.write",
                            "documents.read",
                            "documents.write",
                            "files.read",
                            "files.write",
                            "buckets.read",
                            "buckets.write",
                            "functions.read",
                            "functions.write",
                            "execution.read",
                            "execution.write",
                            "locale.read",
                            "avatars.read",
                            "health.read",
                            "migrations.read",
                            "migrations.write"
                        ]
                    }')
                    # http_status=$(execute_curl -b /tmp/appwrite_adapter_session.txt \
                    #     --location "${ENDPOINT}/databases" \
                    #     --header 'Content-Type: application/json' \
                    #     --header 'x-appwrite-mode: admin' \
                    #     --header "x-appwrite-project: ${PROJECT_ID}" \
                    #     --header 'x-appwrite-response-format: 1.4.0' \
                    #     --data-raw '{
                    #     "databaseId": "65f0626fb837a709c15a",
                    #     "name": "test db"
                    # }')
                    # if [ "$http_status" -eq 201 ]; then
                    #     echo "DB created"
                    # else
                    #     echo "failed to create DB"
                    # fi
                    secret=$(echo "$response" | jq -r '.secret')
                    echo "API Key Secret created successfully, writing .env file"
                    if [ -f .env ]; then
                        # Detect the operating system
                        if [[ "$OSTYPE" == "darwin"* ]]; then
                            # macOS (BSD sed)
                            sed -i '' "s/API_KEY_SECRET=.*/API_KEY_SECRET=$secret/" .env || echo "\nAPI_KEY_SECRET=$secret" >>.env
                        else
                            # Linux (GNU sed)
                            sed -i "s/API_KEY_SECRET=.*/API_KEY_SECRET=$secret/" .env || echo "\nAPI_KEY_SECRET=$secret" >>.env
                        fi
                        exit 0
                    fi
                else
                    echo "Failed to create project with status code: $http_status"
                    docker compose -f ./appwrite/compose.yml down --volumes
                    exit 1
                fi
            else
                echo "Failed to create team with status code: $http_status"
                docker compose -f ./appwrite/compose.yml down --volumes
                exit 1
            fi
        else
            echo "Failed to create session with status code: $http_status"
            docker compose -f ./appwrite/compose.yml down --volumes
            exit 1
        fi
    else
        echo "Failed to create account with status code: $http_status"
        docker compose -f ./appwrite/compose.yml down --volumes
        exit 1
    fi

else
    echo FAILED TO START APPWRITE INSTANCE
    exit 1
fi
