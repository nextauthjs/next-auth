import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { users, accounts, sessions, verificationTokens } from "../../src/lib/pg"

const connectionString = "postgres://nextauth:nextauth@localhost:5432/nextauth"
const sql = postgres(connectionString, { max: 1 })

export const db = drizzle(sql, {
  schema: { users, accounts, sessions, verificationTokens },
})
export { users, accounts, sessions, verificationTokens }
