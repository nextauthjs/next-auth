import { AdapterAccount } from "@auth/core/adapters"
import { mysqlTable, text, timestamp, int, primaryKey } from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"
import { users, accounts, sessions, verificationTokens, defaultSchema } from "../../../src/mysql"

export const customUsersTable = mysqlTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
  image: text("image"),
  phone: text("phone")
})

export const customAccountsTable = mysqlTable("accounts", {
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: int("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
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