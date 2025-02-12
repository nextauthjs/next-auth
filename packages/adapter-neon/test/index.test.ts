import { runBasicTests } from "utils/adapter"
import NeonAdapter from "../src"
import { neonConfig, Pool } from "@neondatabase/serverless"

// Using websockets
import ws from "ws"
neonConfig.webSocketConstructor = ws

// Some defaults to make Neon work with Postgres in Docker
// Not required to do it in production
// Set the WebSocket proxy to work with the local instance
neonConfig.wsProxy = (host) => `${host}:5433/v1`
// Disable all authentication and encryption
neonConfig.pipelineTLS = false
neonConfig.pipelineConnect = false
neonConfig.useSecureWebSocket = false

const POOL_SIZE = 20

const client = new Pool({
  host: "127.0.0.1",
  database: "postgres",
  user: "postgres",
  password: "postgres",
  port: 5432,
  max: POOL_SIZE,
})

runBasicTests({
  adapter: NeonAdapter(client),
  db: {
    disconnect: async () => {
      await client.end()
    },
    user: async (id: string) => {
      const sql = `select * from users where id = $1`
      const result = await client.query(sql, [id])
      return result.rowCount !== 0 ? result.rows[0] : null
    },
    account: async (account) => {
      const sql = `
          select * from accounts where "providerAccountId" = $1`

      const result = await client.query(sql, [account.providerAccountId])
      return result.rowCount !== 0 ? result.rows[0] : null
    },
    session: async (sessionToken) => {
      const result1 = await client.query(
        `select * from sessions where "sessionToken" = $1`,
        [sessionToken]
      )
      return result1.rowCount !== 0 ? result1.rows[0] : null
    },
    async verificationToken(identifier_token) {
      const { identifier, token } = identifier_token
      const sql = `
          select * from verification_token where identifier = $1 and token = $2`

      const result = await client.query(sql, [identifier, token])
      return result.rowCount !== 0 ? result.rows[0] : null
    },
  },
})
