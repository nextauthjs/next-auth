import { randomUUID } from "crypto"
import { index, int, mysqlTableCreator, primaryKey, timestamp, varchar } from "drizzle-orm/mysql-core"
import { drizzle } from "drizzle-orm/mysql2"
import { createPool } from "mysql2"

const poolConnection = createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "next-auth",
})

export const db = drizzle(poolConnection)

const mysqlTable = mysqlTableCreator((name) => `project1_${name}`);

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
  image: varchar("image", { length: 255 }),
 })
 
 export const accounts = mysqlTable(
  "accounts",
   {
    userId: varchar("userId", { length: 255 })
       .notNull()
       .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
     provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
   token_type: varchar("token_type", { length: 255 }),
   scope: varchar("scope", { length: 255 }),
   id_token: varchar("id_token", { length: 2048 }),
   session_state: varchar("session_state", { length: 255 }),
 },
 (account) => ({
    compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    userIdIdx: index('Account_userId_index').on(account.userId),
 })
 )
 
 export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => randomUUID()),
  sessionToken: varchar("sessionToken", { length: 255 }).unique(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
 }, (session) => ({
  userIdIdx: index('Session_userId_index').on(session.userId),
 }))
 
 export const verificationTokens = mysqlTable(
 "verificationTokens",
 {
   identifier: varchar("identifier", { length: 255 }).notNull(),
   token: varchar("token", { length: 255 }).notNull().unique(),
   expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 })
 )
