import { runBasicTests } from "utils/adapter"
import { mapExpiresAt } from "../src"
import postgres from "postgres"
import PostgresJSAdapter from "../src"

const connectionString = "postgres://pgjs:pgjs@localhost:6432/db"
export const sql = postgres(connectionString, {
  //ssl: "allow",
  max: 1,
  idle_timeout: 30,
  connect_timeout: 30,
  prepare: true,
  fetch_types: true,
})

const PGCONTAINER = "postgresjs-adapter-test"

runBasicTests({
  adapter: PostgresJSAdapter(sql),
  db: {
    connect: async () => {
      await Promise.all([
        await sql`delete * from users`,
        await sql`delete * from accounts`,
        await sql`delete * from sessions`,
        await sql`delete * from verification_token`,
      ])
    },
    disconnect: async () => {
      await Promise.all([
        await sql`delete * from users`,
        await sql`delete * from accounts`,
        await sql`delete * from sessions`,
        await sql`delete * from verification_token`,
      ])
      await sql.end()
    },
    user: async (id) => {
      await sql`select * from users where id = ${id}`.then(
        (res) => res[0] ?? null
      )
    },
    account: async (account) => {
      await sql`select * from accounts where "providerAccountId" = ${account.providerAccountId}`.then(
        (res) => mapExpiresAt(res[0]) ?? null
      )
    },
    session: async (sessionToken) => {
      await sql`select * from sessions where "sessionToken" = ${sessionToken}`.then(
        (res) => res[0] ?? null
      )
    },
    verificationToken: async (identifier_token) => {
      const { identifier, token } = identifier_token
      await sql`
          select * from verification_token where identifier = ${identifier} and token = ${token}`.then(
        (res) => res[0] ?? null
      )
    },
  },
})
