kill -9 $(lsof -t -i:8081)

nohup node ./test/server.js >> app.log 2>&1 &

echo "Wait until the emulator REST API responds"
sleep 10

if npx jest; then
    kill -9 $(lsof -t -i:8081)
fi