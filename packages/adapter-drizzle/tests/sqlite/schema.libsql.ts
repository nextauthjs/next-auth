import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client/sqlite3"
import { createTables } from "../../src/lib/sqlite"
import { sqliteTable } from "drizzle-orm/sqlite-core"

const sqlite = createClient({ url: "file:./db.sqlite" })

export const { users, accounts, sessions, verificationTokens } =
  createTables(sqliteTable)
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(sqlite, { schema })
