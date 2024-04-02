import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { index, integer, primaryKey, sqliteTableCreator, text } from "drizzle-orm/sqlite-core"
import { randomUUID } from "crypto"

const sqlite = new Database("db.sqlite")

export const db = drizzle(sqlite)

const sqliteTable = sqliteTableCreator((name) => `foobar_${name}`)

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
 })
 
 export const accounts = sqliteTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
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
    userIdIdx: index('Account_userId_index').on(account.userId),
    compositePk: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
  })
 )
 
 export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
 sessionToken: text("sessionToken").notNull().unique(),
 userId: text("userId")
   .notNull()
   .references(() => users.id, { onDelete: "cascade" }),
 expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 }, (table) => ({
    userIdIdx: index('Session_userId_index').on(table.userId),
 }))
 
 export const verificationTokens = sqliteTable(
 "verificationTokens",
 {
   identifier: text("identifier").notNull(),
   token: text("token").notNull().unique(),
   expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 },
 (vt) => ({
  compositePk: primaryKey({ columns: [vt.identifier, vt.token] }),
 })
 )
