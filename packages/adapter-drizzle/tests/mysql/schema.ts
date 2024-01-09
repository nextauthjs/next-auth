import { mysqlTable } from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
import { createTables } from "../../src/lib/mysql"
import { DrizzleAdapter } from "../../src"

const poolConnection = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
})

const defaultUsers: any = {}

export const { users, accounts, sessions, verificationTokens } =
  createTables(mysqlTable)

// user code
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(poolConnection, { mode: "default", schema })

DrizzleAdapter(db)

const yo = db._.schema?.users

users.
// lib code
await db
  .insert(db._.schema!.users)
  // .insert(db._.schema?.users ?? defaultUsers) // This would be the actualy code
  .values({ id: crypto.randomUUID(), email: "" })
