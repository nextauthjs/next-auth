import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
import { createTables } from "../../src/lib/mysql"

const poolConnection = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
})

export const { accounts, sessions, verificationTokens } =
  createTables(mysqlTable)
export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).defaultNow(),
  image: varchar("image", { length: 255 }),

  // Some other attribute we wan't returned in the session callback
  foo: varchar("foo", { length: 255 }),
})
export const schema = { users, accounts, sessions, verificationTokens }

export const db = drizzle(poolConnection, { schema })
