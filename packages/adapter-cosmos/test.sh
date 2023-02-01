sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
sudo apt-get install net-tools
ipaddr="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
sudo docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
sudo docker stop test-linux-emulator
sudo docker rm test-linux-emulator
sudo docker run -d --rm \
    --publish 8081:8081 \
    --publish 10250-10255:10250-10255 \
    --memory 4g --cpus=2.0 \
    --name=test-linux-emulator \
    --env AZURE_COSMOS_EMULATOR_PARTITION_COUNT=10 \
    --env AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE=$ipaddr \
    --env AZURE_COSMOS_ALLOW_NETWORK_ACCESS \
    --env AZURE_COSMOS_EMULATOR_KEY="C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==" \
    --tty \
    mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator

echo "Wait until the emulator REST API responds"

until [ "$(curl -k -s -o /dev/null -w "%{http_code}" https://127.0.0.1:8081)" == "401" ]; do
    sleep 2;
done;

echo "Emulator REST API ready"

sudo curl -k https://$ipaddr:8081/_explorer/emulator.pem > ~/emulatorcert.crt
sudo cp ~/emulatorcert.crt /usr/local/share/ca-certificates/
sudo update-ca-certificates

npx jest -u -ip=$ipaddr;