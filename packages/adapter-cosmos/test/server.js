const { default: cosmosServer } = require("@zeit/cosmosdb-server");
const server = cosmosServer();
server.listen(8081, () => {
  console.log('server started')
})