import { runBasicTests } from "utils/adapter"
import { mapExpiresAt } from "../src"
import postgres from "postgres"
import PostgresJSAdapter from "../src"

const connectionString = "postgres://pgjs:pgjs@localhost:6432/db"
export const sql = postgres(connectionString, {
  //ssl: "allow",
  max: 20,
  idle_timeout: 30,
  connect_timeout: 30,
  prepare: true,
  fetch_types: true,
})

runBasicTests({
  adapter: PostgresJSAdapter(sql),

  db: {
    //id: () => "",
    user: async (id) => {
      const x = await sql`
          SELECT *
          FROM users
          WHERE id = ${id}`
      return x.length !== 0 ? x[0] : null
    },
    account: async (account) => {
      const x = await sql`
          SELECT *
          FROM accounts
          WHERE "providerAccountId" = ${account.providerAccountId}
        `
      return x.length !== 0 ? mapExpiresAt(x[0]) : null
    },
    session: async (sessionToken) => {
      const x = await sql`
        SELECT * 
        FROM sessions 
        WHERE "sessionToken" = ${sessionToken}`
      return x.length !== 0 ? x[0] : null
    },
    verificationToken: async (identifier_token) => {
      const { identifier, token } = identifier_token
      const x = await sql`
        SELECT * FROM verification_token
        WHERE identifier = ${identifier} 
        AND token = ${token}`
      return x.length !== 0 ? x[0] : null
    },
  },
})
