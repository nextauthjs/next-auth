import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from 'better-sqlite3';
import { users, sessions, verificationTokens, defaultSchema } from "../../../src/sqlite";
import { int, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { AdapterAccount } from "@auth/core/adapters";
import { } from "drizzle-orm/better-sqlite3";

const sqlite = new Database('db.sqlite');

export const customUsersTable = sqliteTable("users", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  phone: text("phone")
})

export const customAccountsTable = sqliteTable(
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

export { sessions, verificationTokens }
export const db = drizzle(sqlite, {
  schema: {
    users: customUsersTable,
    accounts: customAccountsTable
  }
})