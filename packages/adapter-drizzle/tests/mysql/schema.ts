import type { AdapterAccount } from "@auth/core/adapters"
import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  primaryKey,
} from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  schema,
} from "../../src/mysql"

const poolConnection = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
})

export { users, accounts, sessions, verificationTokens }
export const db = drizzle(poolConnection, {
  schema: schema,
})
