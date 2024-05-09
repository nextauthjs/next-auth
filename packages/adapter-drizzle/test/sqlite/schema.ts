import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "libsql"
import { defineTables } from "../../src/lib/sqlite.ts"

export const {
  usersTable,
  accountsTable,
  sessionsTable,
  verificationTokensTable,
} = defineTables({})

const sqlite = new Database("db.sqlite")

export const db = drizzle(sqlite)
