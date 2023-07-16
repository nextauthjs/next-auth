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
 * ```bash npm2yarn2pnpm
 * npm install drizzle-orm @auth/drizzle-adapter
 * npm install drizzle-kit --save-dev
 * ```
 *
 * @module @auth/drizzle-adapter
 */
import {
  SqlFlavorOptions,
  isMySqlDatabase,
  isPgDatabase,
  isSQLiteDatabase,
} from "./utils"
import type { Adapter } from "@auth/core/adapters"
import { mySqlDrizzleAdapter } from "./mysql"
import { pgDrizzleAdapter } from "./pg"
import { SQLiteDrizzleAdapter } from "./sqlite"
/**
 * Add the adapter to your `app/api/[...nextauth]/route.js` next-auth configuration object.
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
 * ## Setup
 *
 * First, create a schema that includes [the minimum requirements for a `next-auth` adapter](/reference/adapters#models). You can select your favorite SQL flavor below and copy it.
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
 * import { AdapterAccount } from '@auth/core/adapters'
 *
 * export const users = pgTable("users", {
 *  id: text("id").notNull().primaryKey(),
 *  name: text("name"),
 *  email: text("email").notNull(),
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
 *   type: text("type").$type<AdapterAccount["type"]>().notNull(),
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
 *   compoundKey: primaryKey(account.provider, account.providerAccountId),
 * })
 * )
 *
 * export const sessions = pgTable("sessions", {
 *  sessionToken: text("sessionToken").notNull().primaryKey(),
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
 *    compoundKey: primaryKey(vt.identifier, vt.token),
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
 *  id: varchar("id", { length: 255 }).notNull().primaryKey(),
 *  name: varchar("name", { length: 255 }),
 *  email: varchar("email", { length: 255 }).notNull(),
 *   emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }).defaultNow(),
 *  image: varchar("image", { length: 255 }),
 * })
 *
 * export const accounts = mysqlTable(
 *  "accounts",
 *   {
 *    userId: varchar("userId", { length: 255 })
 *       .notNull()
 *       .references(() => users.id, { onDelete: "cascade" }),
 *    type: varchar("type", { length: 255 }).$type<AdapterAccount["type"]>().notNull(),
 *     provider: varchar("provider", { length: 255 }).notNull(),
 *    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
 *    refresh_token: varchar("refresh_token", { length: 255 }),
 *    access_token: varchar("access_token", { length: 255 }),
 *    expires_at: int("expires_at"),
 *   token_type: varchar("token_type", { length: 255 }),
 *   scope: varchar("scope", { length: 255 }),
 *   id_token: varchar("id_token", { length: 255 }),
 *   session_state: varchar("session_state", { length: 255 }),
 * },
 * (account) => ({
 *   compoundKey: primaryKey(account.provider, account.providerAccountId),
 * })
 * )
 *
 * export const sessions = mysqlTable("sessions", {
 *  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
 *  userId: varchar("userId", { length: 255 })
 *    .notNull()
 *    .references(() => users.id, { onDelete: "cascade" }),
 *  expires: timestamp("expires", { mode: "date" }).notNull(),
 * })
 *
 * export const verificationTokens = mysqlTable(
 * "verificationToken",
 * {
 *   identifier: varchar("identifier", { length: 255 }).notNull(),
 *   token: varchar("token", { length: 255 }).notNull(),
 *   expires: timestamp("expires", { mode: "date" }).notNull(),
 * },
 * (vt) => ({
 *   compoundKey: primaryKey(vt.identifier, vt.token),
 * })
 * )
 * ```
 *
 * ### SQLite
 *
 * ```ts title="schema.ts"
 * import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
 * import { AdapterAccount } from "@auth/core/adapters"
 *
 * export const users = sqliteTable("users", {
 *  id: text("id").notNull().primaryKey(),
 *  name: text("name"),
 *  email: text("email").notNull(),
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
 *    type: text("type").$type<AdapterAccount["type"]>().notNull(),
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
 *    compoundKey: primaryKey(account.provider, account.providerAccountId),
 *  })
 * )
 *
 * export const sessions = sqliteTable("sessions", {
 * sessionToken: text("sessionToken").notNull().primaryKey(),
 * userId: text("userId")
 *   .notNull()
 *   .references(() => users.id, { onDelete: "cascade" }),
 * expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 * })
 *
 * export const verificationTokens = sqliteTable(
 * "verificationToken",
 * {
 *   identifier: text("identifier").notNull(),
 *   token: text("token").notNull(),
 *   expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 * },
 * (vt) => ({
 *   compoundKey: primaryKey(vt.identifier, vt.token),
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
export function DrizzleAdapter<SqlFlavor extends SqlFlavorOptions>(db: SqlFlavor,): Adapter {
  if (isMySqlDatabase(db)) {
    // We need to cast to unknown since the type overlaps (PScale is MySQL based)
    return mySqlDrizzleAdapter(db)
  }

  if (isPgDatabase(db)) {
    return pgDrizzleAdapter(db)
  }

  if (isSQLiteDatabase(db)) {
    return SQLiteDrizzleAdapter(db)
  }

  throw new Error("Unsupported database type in Auth.js Drizzle adapter.")
}
