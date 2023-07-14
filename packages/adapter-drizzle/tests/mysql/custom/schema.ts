
import { AdapterAccount } from "@auth/core/adapters"
import { mysqlTable, varchar, timestamp, int, primaryKey } from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
import { users, accounts, sessions, verificationTokens, defaultSchema } from "../../../src/mysql"

export const customUsersTable = mysqlTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
  image: varchar("image", { length: 255 }),
  phone: varchar("phone", { length: 255 })
})

export const customAccountsTable = mysqlTable("accounts", {
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: varchar("refresh_token", { length: 255 }),
  access_token: varchar("access_token", { length: 255 }),
  expires_at: int("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: varchar("id_token", { length: 255 }),
  session_state: varchar("session_state", { length: 255 }),
},
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

const poolConnection = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
})

export { users, accounts, sessions, verificationTokens }
export const db = drizzle(poolConnection, {
  schema: {
    ...defaultSchema,
    users: customUsersTable,
    accounts: customAccountsTable
  }
})