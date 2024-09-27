if [ -f .env ]; then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}')
fi

execute_curl() {
    local http_status=$(curl --write-out %{http_code} --silent --output /dev/null "$@")
    echo "$http_status"
}
docker compose -f ./appwrite/compose.yml up -d