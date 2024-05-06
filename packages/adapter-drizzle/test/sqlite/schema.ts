import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "libsql"

export {
  sqliteUsersTable,
  sqliteAccountsTable,
  sqliteSessionsTable,
  sqliteVerificationTokensTable,
} from "../../src/lib/sqlite"

const sqlite = new Database("db.sqlite")

export const db = drizzle(sqlite)
