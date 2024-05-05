/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://orm.drizzle.team">Drizzle ORM</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://orm.drizzle.team">
 *   <img style={{display: "block"}} src="/img/adapters/drizzle.svg" width="38" />
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
import { DefaultMySqlSchema, MySqlDrizzleAdapter } from "./lib/mysql.js"
import { DefaultPostgresSchema, PostgresDrizzleAdapter } from "./lib/pg.js"
import { DefaultSQLiteSchema, SQLiteDrizzleAdapter } from "./lib/sqlite.js"
import { DefaultSchema, SqlFlavorOptions } from "./lib/utils.js"
// import uuid from 'v4-uuid';

import type { Adapter } from "@auth/core/adapters"
/**
 * Create db instance and pass it to adapter. Add this adapter to your `auth.ts` Auth.js configuration object:
 *
 * ```ts title="auth.ts"
 * import NextAuth from "next-auth"
 * import Google from "next-auth/providers/google"
 * import { DrizzleAdapter } from "@auth/drizzle-adapter"
 * import { db } from "./db.ts"
 *
 * export const { handlers, auth } = NextAuth({
 *   adapter: DrizzleAdapter(db),
 *   providers: [
 *     Google,
 *   ],
 * })
 * ```
 * 
 * Follow the Drizzle documentation for [PostgreSQL setup](https://orm.drizzle.team/docs/get-started-postgresql), [MySQL setup](https://orm.drizzle.team/docs/get-started-mysql) and [SQLite setup](https://orm.drizzle.team/docs/get-started-sqlite).
 * 
 * :::info
 * If you want to use your own tables, you can pass them as a second argument. If you add non-nullable columns, make sure to provide a default value or rewrite functions to handle the missing values.
 * :::
 * 
 * ```ts title="auth.ts"
 * import NextAuth from "next-auth"
 * import Google from "next-auth/providers/google"
 * import { DrizzleAdapter } from "@auth/drizzle-adapter"
 * import { accounts, sessions, users, verificationTokens } from "./schema"
 * import { db } from "./db.ts"
 *
 * export const { handlers, auth } = NextAuth({
 *   adapter: DrizzleAdapter(db, { usersTable: users, accountsTable: accounts, sessionsTable: sessions, verificationTokensTable: verificationTokens }),
 *   providers: [
 *     Google,
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
 * import uuid from 'v4-uuid';
 *
 * export const users = pgTable("user", {
 *  id: text("id").primaryKey().$defaultFn(() => uuid()),
 *  name: text("name"),
 *  email: text("email").notNull(),
 *  emailVerified: timestamp("emailVerified", { mode: "date" }),
 *  image: text("image"),
 * })
 *
 * export const accounts = pgTable(
 * "account",
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
 *   compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
 * })
 * )
 *
 * export const sessions = pgTable("session", {
 *  sessionToken: text("sessionToken").primaryKey(),
 *  userId: text("userId")
 *    .notNull()
 *    .references(() => users.id, { onDelete: "cascade" }),
 *  expires: timestamp("expires", { mode: "date" }).notNull(),
 * })
 *
 * export const verificationTokens = pgTable(
 *  "verificationToken",
 *  {
 *    identifier: text("identifier").notNull(),
 *    token: text("token").notNull(),
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
 *  In MySQL, there's no `returning` clause, so in the `createUser` function, we first insert a new user and then search by `email` to get the user's data. To make the search faster, we suggest adding an index to the `email` column.
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
 * export const users = mysqlTable("user", {
 *  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => uuid()),
 *  name: varchar("name", { length: 255 }),
 *  email: varchar("email", { length: 255 }).notNull(),
 *  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
 *  image: varchar("image", { length: 255 }),
 * })
 *
 * export const accounts = mysqlTable(
 *  "account",
 *   {
 *     userId: varchar("userId", { length: 255 })
 *        .notNull()
 *        .references(() => users.id, { onDelete: "cascade" }),
 *     type: varchar("type", { length: 255 }).notNull(),
 *     provider: varchar("provider", { length: 255 }).notNull(),
 *     providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
 *     refresh_token: varchar("refresh_token", { length: 255 }),
 *     access_token: varchar("access_token", { length: 255 }),
 *     expires_at: int("expires_at"),
 *     token_type: varchar("token_type", { length: 255 }),
 *     scope: varchar("scope", { length: 255 }),
 *     id_token: varchar("id_token", { length: 2048 }),
 *     session_state: varchar("session_state", { length: 255 }),
 *   },
 *   (account) => ({
 *     compoundKey: primaryKey({
         columns: [account.provider, account.providerAccountId],
       })
 *   })
 * )
 *
 * export const sessions = mysqlTable("session", {
 *  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
 *  userId: varchar("userId", { length: 255 })
 *    .notNull()
 *    .references(() => users.id, { onDelete: "cascade" }),
 *  expires: timestamp("expires", { mode: "date" }).notNull(),
 * })
 *
 * export const verificationTokens = mysqlTable(
 *  "verificationToken",
 *  {
 *    identifier: varchar("identifier", { length: 255 }).notNull(),
 *    token: varchar("token", { length: 255 }).notNull(),
 *    expires: timestamp("expires", { mode: "date" }).notNull(),
 *  },
 *  (vt) => ({
 *    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 *  })
 * )
 * ```
 *
 * ### SQLite
 *
 * ```ts title="schema.ts"
 * import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
 * import type { AdapterAccount } from "@auth/core/adapters"
 *
 * export const users = sqliteTable("user", {
 *  id: text("id").primaryKey().$defaultFn(() => uuid()),
 *  name: text("name"),
 *  email: text("email").notNull(),
 *  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
 *  image: text("image"),
 * })
 *
 * export const accounts = sqliteTable(
 *  "account",
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
      })
 *  })
 * )
 *
 * export const sessions = sqliteTable("session", {
 *  sessionToken: text("sessionToken").primaryKey(),
 *  userId: text("userId")
 *    .notNull()
 *    .references(() => users.id, { onDelete: "cascade" }),
 *  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 * })
 *
 * export const verificationTokens = sqliteTable(
 *  "verificationToken",
 *  {
 *    identifier: text("identifier").notNull(),
 *    token: text("token").notNull(),
 *    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 *  },
 *  (vt) => ({
 *    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 *  })
 * )
 * ```
 *
 * ## Migrating your database
 * With your schema now described in your code, you'll need to migrate your database to your schema.
 *
 * For full documentation on how to run migrations with Drizzle, [visit the Drizzle documentation](https://orm.drizzle.team/kit-docs/overview#running-migrations) or check how to apply changes directly to the database with [push command](https://orm.drizzle.team/kit-docs/overview#prototyping-with-db-push).
 *
 * ---
 *
 **/
export function DrizzleAdapter<SqlFlavor extends SqlFlavorOptions>(
  db: SqlFlavor,
  schema?: DefaultSchema<SqlFlavor>
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
