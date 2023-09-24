import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { createTables } from "../../src/lib/sqlite"
import { sqliteTableCreator } from "drizzle-orm/sqlite-core"

const sqlite = new Database("db.sqlite")

const sqliteTable = sqliteTableCreator((name) => `foobar_${name}`)

export const { users, accounts, sessions, verificationTokens } =
  createTables(sqliteTable)
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(sqlite, { schema })
