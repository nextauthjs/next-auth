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
  ClientFlavors,
  MinimumSchema,
  SqlFlavorOptions,
  isMySqlDatabase,
  isPgDatabase,
  isPlanetScaleDatabase,
  isSQLiteDatabase,
} from "./lib/utils"
import type { Adapter } from "@auth/core/adapters"
import { MySqlAdapter } from "./lib/mysql"
import { PgAdapter } from "./lib/pg"
import { PlanetScaleAdapter } from "./lib/planetscale"
import { SQLiteAdapter } from "./lib/sqlite"

/**
 * Add the adapter to your `app/api/[...nextauth]/route.js` next-auth configuration object.
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { DrizzleAdapter } from "@auth/drizzle-adapter"
 * import { db, users, accounts, sessions, verificationTokens } from "./schema"
 *
 * export default NextAuth({
 *   adapter: DrizzleAdapter(db, { users, accounts, sessions, verificationTokens }),
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
 * First, create a schema that includes [the minimum requirements for a `next-auth` adapter](/reference/adapters#models).
 * Be sure to use the Drizzle driver version that you're using for your project.
 *
 * - [Postgres](#postgres)
 * - [PlanetScale](#planetscale)
 * - [MySQL](#mysql)
 * - [SQLite](#sqlite)
 *
 *
 * ### Postgres
 *
 *    ```ts title="schema.ts"
 *    import { integer, pgTable, text, primaryKey } from "drizzle-orm/pg-core"
 *    import { drizzle } from "drizzle-orm/vercel-postgres"
 *    import { migrate } from "drizzle-orm/vercel-postgres/migrator"
 *    import { createPool } from "@vercel/postgres"
 *    import { ProviderType } from "next-auth/providers"
 *
 *    const connection = createPool({ connectionString: process.env.POSTGRES_URL })
 *    export const db = drizzle(connection)
 *
 *    export const users = pgTable("users", {
 *      id: text("id").notNull().primaryKey(),
 *      name: text("name"),
 *      email: text("email").notNull(),
 *      emailVerified: integer("emailVerified"),
 *      image: text("image"),
 *    })
 *
 *    export const accounts = pgTable("accounts", {
 *      userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
 *      type: text("type").$type<ProviderType>().notNull(),
 *      provider: text("provider").notNull(),
 *      providerAccountId: text("providerAccountId").notNull(),
 *      refresh_token: text("refresh_token"),
 *      access_token: text("access_token"),
 *      expires_at: integer("expires_at"),
 *      token_type: text("token_type"),
 *      scope: text("scope"),
 *      id_token: text("id_token"),
 *      session_state: text("session_state"),
 *    }, (account) => ({
 *      _: primaryKey(account.provider, account.providerAccountId)
 *    }))
 *
 *    export const sessions = pgTable("sessions", {
 *      userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
 *      sessionToken: text("sessionToken").notNull().primaryKey(),
 *      expires: integer("expires").notNull(),
 *    })
 *
 *    export const verificationTokens = pgTable("verificationToken", {
 *      identifier: text("identifier").notNull(),
 *      token: text("token").notNull(),
 *      expires: integer("expires").notNull()
 *    }, (vt) => ({
 *      _: primaryKey(vt.identifier, vt.token)
 *    }))
 * ```
 *
 * ### PlanetScale
 *
 *```ts title="schema.ts"
 * import {
 *   int,
 *   timestamp,
 *   mysqlTable,
 *   varchar,
 *   primaryKey,
 * } from "drizzle-orm/mysql-core"
 * import { drizzle } from "drizzle-orm/planetscale-serverless"
 * import { ProviderType } from "next-auth/providers"
 * import { connect } from "@planetscale/database"
 *
 * const connection = connect({
 *   host: process.env["DATABASE_HOST"],
 *   username: process.env["DATABASE_USERNAME"],
 *   password: process.env["DATABASE_PASSWORD"],
 * })
 *
 * export const db = drizzle(connection)
 *
 * export const users = mysqlTable("users", {
 *   id: varchar("id", { length: 255 }).notNull().primaryKey(),
 *   name: varchar("name", { length: 255 }),
 *   email: varchar("email", { length: 255 }).notNull(),
 *   emailVerified: timestamp("emailVerified", { mode: "date" }),
 *   image: varchar("image", { length: 255 }),
 * })

 * export const accounts = mysqlTable("accounts",
 *   {
 *     userId: varchar("userId", { length: 255 }).notNull(),
 *     type: varchar("type", { length: 255 }).$type<ProviderType>().notNull(),
 *     provider: varchar("provider", { length: 255 }).notNull(),
 *     providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
 *     refresh_token: varchar("refresh_token", { length: 255 }),
 *     access_token: varchar("access_token", { length: 255 }),
 *     expires_at: int("expires_at"),
 *     token_type: varchar("token_type", { length: 255 }),
 *     scope: varchar("scope", { length: 255 }),
 *     id_token: varchar("id_token", { length: 255 }),
 *     session_state: varchar("session_state", { length: 255 }),
 *   },
 *   (account) => ({
 *     compoundKey: primaryKey(account.provider, account.providerAccountId),
 *   })
 * )

 * export const sessions = mysqlTable("sessions", {
 *   sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
 *   userId: varchar("userId", { length: 255 }).notNull(),
 *   expires: timestamp("expires", { mode: "date" }).notNull(),
 * })

 * export const verificationTokens = mysqlTable("verificationToken",
 *   {
 *     identifier: varchar("identifier", { length: 255 }).notNull(),
 *     token: varchar("token", { length: 255 }).notNull(),
 *     expires: timestamp("expires", { mode: "date" }).notNull(),
 *   },
 *   (vt) => ({
 *     compoundKey: primaryKey(vt.identifier, vt.token),
 *   })
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
 *  text,
 *  primaryKey,
 * } from "drizzle-orm/mysql-core"
 * import { ProviderType } from "next-auth/providers"
 * import { drizzle } from "drizzle-orm/mysql2"
 * import mysql from "mysql2/promise"
 *
 * const poolConnection = mysql.createPool({})
 *
 * export const db = drizzle(poolConnection)
 *
 * export const users = mysqlTable("users", {
 *   id: text("id").notNull().primaryKey(),
 *   name: text("name"),
 *   email: text("email").notNull(),
 *   emailVerified: timestamp("emailVerified", { mode: "date" }),
 *   image: text("image"),
 * })
 *
 * export const accounts = mysqlTable("accounts",
 *   {
 *    userId: text("userId")
 *      .notNull()
 *      .references(() => users.id, { onDelete: "cascade" }),
 *    type: text("type").$type<ProviderType>().notNull(),
 *    provider: text("provider").notNull(),
 *    providerAccountId: text("providerAccountId").notNull(),
 *    refresh_token: text("refresh_token"),
 *    access_token: text("access_token"),
 *    expires_at: int("expires_at"),
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
 * export const sessions = mysqlTable("sessions", {
 * sessionToken: text("sessionToken").notNull().primaryKey(),
 * userId: text("userId")
 *   .notNull()
 *   .references(() => users.id, { onDelete: "cascade" }),
 * expires: timestamp("expires", { mode: "date" }).notNull(),
 * })
 *
 * export const verificationTokens = mysqlTable(
 * "verificationToken",
 * {
 *   identifier: text("identifier").notNull(),
 *   token: text("token").notNull(),
 *   expires: timestamp("expires", { mode: "date" }).notNull(),
 * },
 * (vt) => ({
 *   compoundKey: primaryKey(vt.identifier, vt.token),
 *  })
 * )
 * ```
 *
 * ### SQLite
 *
 * ```ts title="schema.ts"
 * import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
 * import { drizzle } from "drizzle-orm/better-sqlite3"
 * import Database from "better-sqlite3"
 * import { ProviderType } from "next-auth/providers"
 *
 * const sqlite = new Database("db.sqlite")
 * export const db = drizzle(sqlite)
 *
 * export const users = sqliteTable("users", {
 *   id: text("id").notNull().primaryKey(),
 *   name: text("name"),
 *   email: text("email").notNull(),
 *   emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
 *   image: text("image"),
 * })
 *
 * export const accounts = sqliteTable("accounts",
 *   {
 *     userId: text("userId")
 *       .notNull()
 *       .references(() => users.id, { onDelete: "cascade" }),
 *    type: text("type").$type<ProviderType>().notNull(),
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
 *   sessionToken: text("sessionToken").notNull().primaryKey(),
 *   userId: text("userId")
 *     .notNull()
 *     .references(() => users.id, { onDelete: "cascade" }),
 *   expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 * })
 *
 * export const verificationTokens = sqliteTable("verificationToken",
 *   {
 *     identifier: text("identifier").notNull(),
 *     token: text("token").notNull(),
 *     expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
 *   },
 *   (vt) => ({
 *     compoundKey: primaryKey(vt.identifier, vt.token),
 *   })
 * )
 * ```
 *
 * ## Migrating your database
 * With your schema now described in your code, you'll need to migrate your database to your schema.
 *
 * For full documentation of how to run migrations with Drizzle, [visit the Drizzle documentation](https://orm.drizzle.team/kit-docs/overview#running-migrations).
 *
 * In short, you'll create and execute a migrator file with your SQL flavor and client. We're using `postgres-js` for the example below.
 *
 * ```json title="migrator.ts"
 * import { drizzle } from "drizzle-orm/postgres-js";
 * import { migrate } from "drizzle-orm/postgres-js/migrator";
 * import postgres from "postgres";
 *
 * const sql = postgres("...", { max: 1 })
 * const db = drizzle(sql);
 *
 * await migrate(db, { migrationsFolder: "drizzle" });
 * ```
 *
 **/
export function DrizzleAdapter<SqlFlavor extends SqlFlavorOptions>(
  db: SqlFlavor,
  schema: ClientFlavors<SqlFlavor>
): Adapter {
  if (isMySqlDatabase(db)) {
    // We need to cast to unknown since the type overlaps (PScale is MySQL based)
    return MySqlAdapter(db, schema as unknown as MinimumSchema["mysql"])
  }

  if (isPlanetScaleDatabase(db)) {
    // We need to cast to unknown since the type overlaps (PScale is MySQL based)
    return PlanetScaleAdapter(
      db,
      schema as unknown as MinimumSchema["planetscale"]
    )
  }

  if (isPgDatabase(db)) {
    return PgAdapter(db, schema as MinimumSchema["pg"])
  }

  if (isSQLiteDatabase(db)) {
    return SQLiteAdapter(db, schema as MinimumSchema["sqlite"])
  }

  throw new Error("Unsupported database type in Auth.js Drizzle adapter.")
}
