/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://orm.drizzle.team">Drizzle ORM</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://orm.drizzle.team">
 *   <img style={{display: "block"}} src="/img/adapters/drizzle-orm.png" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install drizzle-orm @auth/drizzle-adapter
 * npm install drizzle-kit --save-dev
 * ```
 *
 * @module @auth/drizzle-adapter
 */

import { is } from "drizzle-orm"
import { MySqlDatabase } from "drizzle-orm/mysql-core"
import { PgDatabase } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
import { DefaultSchema, SqlFlavorOptions } from "./lib/utils"
import { DefaultSQLiteSchema, SQLiteDrizzleAdapter, getDefaultSQLiteSchema } from "./lib/sqlite"
import { PostgresDrizzleAdapter, DefaultPostgresSchema, getDefaultPostgresSchema } from './lib/pg'
import { MySqlDrizzleAdapter, DefaultMySqlSchema, getDefaultMySqlSchema } from './lib/mysql'
// @ts-ignore
import type { Adapter } from "@auth/core/adapters"

/**
 * Add the adapter to your `pages/api/[...nextauth].ts` next-auth configuration object.
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { DrizzleAdapter } from "@auth/drizzle-adapter"
 * import { db } from "./schema"
 *
 * export default NextAuth({
 *   adapter: DrizzleAdapter(db),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 * 
 * :::info
 * If you want to use your own tables, you can pass them as a second argument
 * :::
 * 
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { DrizzleAdapter } from "@auth/drizzle-adapter"
 * import { db, accounts, sessions, users, verificationTokens } from "./schema"
 *
 * export default NextAuth({
 *   adapter: DrizzleAdapter(db, { usersTable: users, accountsTable: accounts, sessionsTable: sessions, verificationTokensTable: verificationTokens }),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ## Setup
 *
 * First, create a schema that includes [the minimum requirements for a `next-auth` adapter](/reference/core/adapters#models). You can select your favorite SQL flavor below and copy it.
 * Additionally, you may extend the schema from the minimum requirements to suit your needs.
 *
 * - [Postgres](#postgres)
 * - [MySQL](#mysql)
 * - [SQLite](#sqlite)
 *
 * ### Postgres

 * ```ts title="schema.ts"
 * import {
 *   timestamp,
 *   pgTable,
 *   text,
 *   primaryKey,
 *  integer
 * } from "drizzle-orm/pg-core"
 * import type { AdapterAccount } from '@auth/core/adapters'
 * import { randomUUID } from "crypto"
 *
 * export const users = pgTable("users", {
 *  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
 *  name: text("name"),
 *  email: text("email").unique(),
 *  emailVerified: timestamp("emailVerified", { mode: "date" }),
 *  image: text("image"),
 * })
 *
 * export const accounts = pgTable(
 * "accounts",
 * {
 *   userId: text("userId")
 *     .notNull()
 *     .references(() => users.id, { onDelete: "cascade" }),
 *   type: text("type").notNull(),
 *   provider: text("provider").notNull(),
 *   providerAccountId: text("providerAccountId").notNull(),
 *   refresh_token: text("refresh_token"),
 *   access_token: text("access_token"),
 *   expires_at: integer("expires_at"),
 *   token_type: text("token_type"),
 *   scope: text("scope"),
 *    id_token: text("id_token"),
 *   session_state: text("session_state"),
 * },
 * (account) => ({
 *   userIdIdx: index().on(account.userId),
 *   compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
 * })
 * )
 *
 * export const sessions = pgTable("sessions", {
 *  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
 *  sessionToken: text("sessionToken").notNull().unique(),
 *  userId: text("userId")
 *    .notNull()
 *    .references(() => users.id, { onDelete: "cascade" }),
 *  expires: timestamp("expires", { mode: "date" }).notNull(),
 * }, (session) => ({
 *   userIdIdx: index().on(session.userId)
 * }))
 *
 * export const verificationTokens = pgTable(
 *  "verificationTokens",
 *  {
 *    identifier: text("identifier").notNull(),
 *    token: text("token").notNull().unique(),
 *    expires: timestamp("expires", { mode: "date" }).notNull(),
 *  },
 *  (vt) => ({
 *    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 *  })
 * )
 * ```
 *
 * ### MySQL
 *
 * ```ts title="schema.ts"
 * import {
 *  int,
 *  timestamp,
 *  mysqlTable,
 *  primaryKey,
 *  varchar,
 * } from "drizzle-orm/mysql-core"
 * import type { AdapterAccount } from "@auth/core/adapters"
 *
 * export const users = mysqlTable("users", {
 *  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => randomUUID()),
 *  name: varchar("name", { length: 255 }),
 *  email: varchar("email", { length: 255 }).unique(),
 *  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
 *  image: varchar("image", { length: 255 }),
 * })
 *
 * export const accounts = mysqlTable(
 *  "accounts",
 *   {
 *    userId: varchar("userId", { length: 255 })
 *       .notNull()
 *       .references(() => users.id, { onDelete: "cascade" }),
 *    type: varchar("type", { length: 255 }).notNull(),
 *    provider: varchar("provider", { length: 255 }).notNull(),
 *    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
 *    refresh_token: varchar("refresh_token", { length: 255 }),
 *    access_token: varchar("access_token", { length: 255 }),
 *    expires_at: int("expires_at"),
 *   token_type: varchar("token_type", { length: 255 }),
 *   scope: varchar("scope", { length: 255 }),
 *   id_token: varchar("id_token", { length: 2048 }),
 *   session_state: varchar("session_state", { length: 255 }),
 * },
 * (account) => ({
 *    compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
      userIdIdx: index('Account_userId_index').on(account.userId)
 * })
 * )
 *
 * export const sessions = mysqlTable("sessions", {
 *  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => randomUUID()),
 *  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
 *  userId: varchar("userId", { length: 255 })
 *    .notNull()
 *    .references(() => users.id, { onDelete: "cascade" }),
 *  expires: timestamp("expires", { mode: "date" }).notNull(),
 * }, (session) => ({
 *  userIdIdx: index('Session_userId_index').on(session.userId)
 * }))
 *
 * export const verificationTokens = mysqlTable(
 * "verificationTokens",
 * {
 *   identifier: varchar("identifier", { length: 255 }).notNull(),
 *   token: varchar("token", { length: 255 }).notNull().unique(),
 *   expires: timestamp("expires", { mode: "date" }).notNull(),
 * },
 * (vt) => ({
 *   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 * })
 * )
 * ```
 *
 * ### SQLite
 *
 * ```ts title="schema.ts"
 * import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
 * import type { AdapterAccount } from "@auth/core/adapters"
 *
 * export const users = sqliteTable("users", {
 *  id: text("id").primaryKey().$defaultFn(() => randomUUID()),
 *  name: text("name"),
 *  email: text("email").unique(),
 *  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
 *  image: text("image"),
 * })
 *
 * export const accounts = sqliteTable(
 *  "accounts",
 *  {
 *    userId: text("userId")
 *      .notNull()
 *      .references(() => users.id, { onDelete: "cascade" }),
 *    type: text("type").notNull(),
 *    provider: text("provider").notNull(),
 *    providerAccountId: text("providerAccountId").notNull(),
 *    refresh_token: text("refresh_token"),
 *    access_token: text("access_token"),
 *    expires_at: integer("expires_at"),
 *    token_type: text("token_type"),
 *    scope: text("scope"),
 *    id_token: text("id_token"),
 *    session_state: text("session_state"),
 *  },
 *  (account) => ({
 *    compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
      userIdIdx: index('Account_userId_index').on(account.userId)
 *  })
 * )
 *
 * export const sessions = sqliteTable("sessions", {
 * id: text("id").primaryKey().$defaultFn(() => randomUUID())
 * sessionToken: text("sessionToken").notNull().unique(),
 * userId: text("userId")
 *   .notNull()
 *   .references(() => users.id, { onDelete: "cascade" }),
 * expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 * }, (table) => ({
 *  userIdIdx: index('Session_userId_index').on(table.userId)
 * }))
 *
 * export const verificationTokens = sqliteTable(
 * "verificationTokens",
 * {
 *   identifier: text("identifier").notNull(),
 *   token: text("token").notNull().unique(),
 *   expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 * },
 * (vt) => ({
 *   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 * })
 * )
 * ```
 *
 * ## Migrating your database
 * With your schema now described in your code, you'll need to migrate your database to your schema.
 *
 * For full documentation on how to run migrations with Drizzle, [visit the Drizzle documentation](https://orm.drizzle.team/kit-docs/overview#running-migrations).
 *
 * ---
 *
 **/
export function DrizzleAdapter<SqlFlavor extends SqlFlavorOptions>(
  db: SqlFlavor,
  schema?: Partial<DefaultSchema<SqlFlavor>>
): Adapter {
  if (is(db, MySqlDatabase)) {
    return MySqlDrizzleAdapter(db, schema as DefaultMySqlSchema)
  } else if (is(db, PgDatabase)) {
    return PostgresDrizzleAdapter(db, schema as DefaultPostgresSchema)
  } else if (is(db, BaseSQLiteDatabase)) {
    return SQLiteDrizzleAdapter(db, schema as DefaultSQLiteSchema)
  }

  throw new Error(
    `Unsupported database type (${typeof db}) in Auth.js Drizzle adapter.`
  )
}

export function getDefaultSchema<SqlFlavor extends SqlFlavorOptions>(
  db: SqlFlavor
) {
  if (is(db, MySqlDatabase)) {
    return getDefaultMySqlSchema()
  } else if (is(db, PgDatabase)) {
    return getDefaultPostgresSchema()
  } else if (is(db, BaseSQLiteDatabase)) {
    return getDefaultSQLiteSchema()
  }

  throw new Error(
    `Unsupported database type (${typeof db}) in Auth.js Drizzle adapter.`
  )
}
