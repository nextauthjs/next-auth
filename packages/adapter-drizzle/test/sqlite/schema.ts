import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { sqliteTable } from "drizzle-orm/sqlite-core"
import { createTables } from "../../src/lib/sqlite"

const sqlite = new Database("db.sqlite")

export const { users, accounts, sessions, verificationTokens, authenticators } =
  createTables(sqliteTable)
export const schema = {
  users,
  accounts,
  sessions,
  verificationTokens,
  authenticators,
}

export const db = drizzle(sqlite, { schema })
