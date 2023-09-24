import { runBasicTests } from "@auth/adapter-test"
import PostgresAdapter, { mapExpiresAt } from "../src"
import { Pool } from "pg"

const POOL_SIZE = 20

const client = new Pool({
  host: "127.0.0.1",
  database: "adapter-postgres-test",
  user: "pg",
  password: "pg",
  port: 5432,
  max: POOL_SIZE,
})

runBasicTests({
  adapter: PostgresAdapter(client),
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
      return result.rowCount !== 0 ? mapExpiresAt(result.rows[0]) : null
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
