import { randomUUID } from "crypto"
import { index, integer, pgTableCreator, primaryKey, text, timestamp } from "drizzle-orm/pg-core"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const connectionString = "postgres://nextauth:nextauth@localhost:5432/nextauth"
const sql = postgres(connectionString)

export const db = drizzle(sql)

const pgTable = pgTableCreator((name) => `project1_${name}`);

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
})

export const accounts = pgTable(
  "account",
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
  (table) => {
    return {
      userIdIdx: index().on(table.userId),
      compositePk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
    }
  }
)

export const sessions = pgTable("session", {
  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
  sessionToken: text("sessionToken").notNull().unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => {
  return {
    userIdIdx: index().on(table.userId),
  }
})

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => {
    return {
      compositePk: primaryKey({ columns: [table.identifier, table.token] })
    }
  }
)
