import { runBasicTests } from "utils/adapter"
import { mapExpiresAt } from "../src"
import postgres from "postgres"
import PostgresJSAdapter from "../src"

export const sql = postgres(
  process.env.POSTGRES_URL ||
    "postgresql://dev:xoxo@localhost:5432/postgresjs-test",
  {
    //host: '', // Postgres ip address[es] or domain name[s]
    //port: 5432, // Postgres server port[s]
    //path: '', // unix socket path (usually '/tmp')
    //database: '', // Name of database to connect to
    //username: '', // Username of database user
    //password: '', // Password of database user
    ssl: "allow",
    max: 20,
    idle_timeout: 30,
    connect_timeout: 30,
    prepare: true,
    fetch_types: true,
  }
)

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
    const result = await sql`select * from accounts where providerAccountId = ${account.providerAccountId}`
      return result.count !== 0 ? mapExpiresAt(result[0]) : null
    },
    session: async (sessionToken) => {
      const result1 = await sql`select * from sessions where sessionToken = ${sessionToken}`
      return result1.count !== 0 ? result1[0] : null
    },
    async verificationToken(identifier_token) {
      const { identifier, token } = identifier_token
      const result =await sql`
          select * from verification_token where identifier = ${identifier} and token = ${token}`

      return result.count !== 0 ? result[0] : null
    },
  },
})
