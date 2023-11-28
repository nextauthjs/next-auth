import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import { createTables } from "../../src/lib/sqlite"
import { sqliteTable } from "drizzle-orm/sqlite-core"

const client = createClient({
  url: "file:db.sqlite",
})

export const { users, accounts, sessions, verificationTokens } =
  createTables(sqliteTable)
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(client, { schema })
