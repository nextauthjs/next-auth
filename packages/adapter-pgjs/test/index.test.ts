import { runBasicTests } from "utils/adapter"
import PostgresJSAdapter from "../src"
import postgres from "postgres"

const sql = postgres({
  host: "127.0.0.1",
  database: "pgjs",
  user: "pgjs",
  password: "pgjs",
  port: 6969,
  max: 20,
})

runBasicTests({
  adapter: PostgresJSAdapter(sql),
  testWebAuthnMethods: true,
  db: {
    disconnect: async () => {
      await sql.end()
    },
    user: async (id: string) => {
      const result = await sql`select * from users where id = ${id}`
      return result.count !== 0 ? result[0] : null
    },
    account: async (account) => {
      const result =
        await sql`select * from accounts where "providerAccountId" = ${account.providerAccountId}`
      return result.count !== 0 ? result[0] : null
    },
    session: async (sessionToken) => {
      const result = await sql`
        select * from sessions where "sessionToken" = ${sessionToken}`
      return result.count !== 0 ? result[0] : null
    },
    async verificationToken (identifier_token) {
      const { identifier, token } = identifier_token
      const result =
        await sql` select * from verification_token where identifier = ${identifier} and token = ${token}`
      return result.count !== 0 ? result[0] : null
    },
    authenticator: async (credentialID) => {
      const result =
        await sql`select * from authenticators where "credentialID" = ${credentialID}`
      return result[0]
    },
  },
})