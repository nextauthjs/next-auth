import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { createTables } from "../../src/lib/sqlite"
import { sqliteTable } from "drizzle-orm/sqlite-core"

const sqlite = new Database("db.sqlite")

export const { users, accounts, sessions, verificationTokens } =
  createTables(sqliteTable)
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(sqlite, { schema })
