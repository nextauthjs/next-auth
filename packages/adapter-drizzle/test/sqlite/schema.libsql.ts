import { createClient } from "@libsql/client/sqlite3"
import { drizzle } from "drizzle-orm/libsql"
import { sqliteTable } from "drizzle-orm/sqlite-core"
import { createTables } from "../../src/lib/sqlite"

const sqlite = createClient({ url: "file:./db.sqlite" })

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
