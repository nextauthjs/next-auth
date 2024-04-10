import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
export {
  mysqlUsersTable,
  mysqlAccountsTable,
  mysqlSessionsTable,
  mysqlVerificationTokensTable,
} from "../../src/lib/mysql"

const poolConnection = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
})

export const db = drizzle(poolConnection)
