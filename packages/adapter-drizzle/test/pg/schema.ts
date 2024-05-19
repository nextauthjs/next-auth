import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { defineTables } from "../../src/lib/pg"

export const {
  usersTable,
  accountsTable,
  sessionsTable,
  verificationTokensTable,
} = defineTables({})

const connectionString = "postgres://nextauth:nextauth@127.0.0.1:5432/nextauth"
const sql = postgres(connectionString)

export const db = drizzle(sql)
