import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
export { sqliteUsersTable, sqliteAccountsTable, sqliteSessionsTable, sqliteVerificationTokensTable } from "../../src/lib/sqlite"

const sqlite = new Database("db.sqlite")

export const db = drizzle(sqlite)
