import { drizzle } from "drizzle-orm/postgres-js"
import { sessions, verificationTokens, defaultSchema } from "../../../src/pg";
import { integer, primaryKey, pgTable, text } from "drizzle-orm/pg-core";
import { AdapterAccount } from "@auth/core/adapters";
import postgres from "postgres";

const customUsersTable = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified"),
  image: text("image"),
  phone: text("phone")
})

const customAccountsTable = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => customUsersTable.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)


const connectionString = "postgres://nextauth:nextauth@localhost:5432/nextauth"
const sql = postgres(connectionString, { max: 1 })

export { customUsersTable, customAccountsTable, sessions, verificationTokens }
export const db = drizzle(sql, {
  schema: {
    ...defaultSchema,
    users: customUsersTable,
    accounts: customAccountsTable
  }
})