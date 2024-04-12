import { runBasicTests } from "utils/adapter"
import PostgresJSAdapter from '../src/index.ts'
import mapExpiresAt from '../src/index.ts'

import postgres from 'postgres'

const sql = postgres({
  database: 'adapter-postgresjs-test',
  transform: {
    undefined: null,
  },
})


runBasicTests({
  adapter: PostgresJSAdapter(sql),
  db: {
    disconnect: async () => {
      await sql.end()
    },
    user: async (id: string) => {
      const result = await sql`select * from users where id = ${id}`
      return result.count !== 0 ? result[0] : null
    },
    account: async (account) => {
      const result = await sql`
      select * from accounts where "providerAccountId" = ${account.providerAccountId}`
      return result.count !== 0 ? mapExpiresAt(result[0]) : null
    },
    session: async (sessionToken) => {
      const result1 = await sql
        `select * from sessions where "sessionToken" = ${sessionToken}`,
      return result1.count !== 0 ? result1[0] : null
    },
    async verificationToken(identifier_token) {
      const { identifier, token } = identifier_token
  
      const result = await sql`
      select * from verification_token where identifier = ${identifier} and token = ${token}`
      return result.rowCount !== 0 ? result.rows[0] : null
    },
  },
})
