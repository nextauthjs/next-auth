import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
import { defineTables } from "../../src/lib/mysql"

export const {
  usersTable,
  accountsTable,
  sessionsTable,
  verificationTokensTable,
  authenticatorsTable,
} = defineTables({})

const poolConnection = createPool({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "next-auth",
})

export const db = drizzle(poolConnection)
