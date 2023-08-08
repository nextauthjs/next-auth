import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import {
  users,
  accounts,
  sessions,
  verificationTokens,
} from "../../src/lib/sqlite"

const sqlite = new Database("db.sqlite")

export { users, accounts, sessions, verificationTokens }
export const db = drizzle(sqlite, {
  schema: {
    users,
    accounts,
    sessions,
    verificationTokens,
  },
})
