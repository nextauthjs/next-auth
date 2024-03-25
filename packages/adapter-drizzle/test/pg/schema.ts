import { pgTable } from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { createTables } from "../../src/lib/pg"

const connectionString = "postgres://nextauth:nextauth@localhost:5432/nextauth"
const sql = postgres(connectionString, { max: 1 })

export const { users, accounts, sessions, verificationTokens, authenticators } =
  createTables(pgTable)
export const schema = {
  users,
  accounts,
  sessions,
  verificationTokens,
  authenticators,
}

export const db = drizzle(sql, {
  schema,
})
