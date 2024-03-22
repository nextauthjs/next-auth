import { mysqlTableCreator } from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
import { createTables } from "../../src/lib/mysql"

const poolConnection = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
})

const mysqlTable = mysqlTableCreator((name) => `foobar_${name}`)

export const { users, accounts, sessions, verificationTokens } =
  createTables(mysqlTable)
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(poolConnection, { schema })
