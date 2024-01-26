import { runBasicTests } from "utils/adapter"
import { mapExpiresAt } from "../src"
import postgres from "postgres"
import PostgresJSAdapter from "../src"

const connectionString = "postgresql://postgres@127.0.0.1:5432/postgresjs-test"
export const sql = postgres(connectionString, {
  ssl: "allow",
  max: 1,
  idle_timeout: 30,
  connect_timeout: 30,
  prepare: true,
  fetch_types: true,
})

runBasicTests({
  adapter: PostgresJSAdapter(sql),
  db: {
    disconnect: async () => {
      await sql.end()
    },
    user: async (id: string) => {
      const result = await sql`select * from users where id = ${id}`
      return result.count === 0 ? null : result[0]
    },
    account: async (account) => {
      const result =
        await sql`select * from accounts where providerAccountId = ${account.providerAccountId}`
      return result.count !== 0 ? mapExpiresAt(result[0]) : null
    },
    session: async (sessionToken) => {
      const result1 =
        await sql`select * from sessions where sessionToken = ${sessionToken}`
      return result1.count !== 0 ? result1[0] : null
    },
    async verificationToken(identifier_token) {
      const { identifier, token } = identifier_token
      const result = await sql`
          select * from verification_token where identifier = ${identifier} and token = ${token}`

      return result.count !== 0 ? result[0] : null
    },
  },
})
