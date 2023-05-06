/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}><a href="https://kysely.dev/">Kysely</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://kysely.dev/">
 *   <img style={{display: "block"}} src="/img/adapters/kysely.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 * ```bash npm2yarn2pnpm
 * npm install next-auth kysely pg @next-auth/kysely-adapter
 * npm install --save-dev @types/pg
 * ```
 *
 * @module @next-auth/kysely-adapter
 */
import { Kysely, SqliteAdapter } from "kysely"
import type { Adapter } from "next-auth/adapters"
import type { Database } from "./database"

type ReturnData<T = never> = Record<string, Date | string | T>
/**
 * ## Basic usage
 * This is the Kysely Adapter for [`next-auth`](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.
 *
 * This adapter supports the same first party dialects that Kysely (as of v0.24.2) supports: PostgreSQL, MySQL, and SQLite. The examples below use PostgreSQL with the [pg](https://www.npmjs.com/package/pg) client.
 * ### Configure Auth.js
 * ```typescript title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { KyselyAdapter } from "@next-auth/kysely-adapter"
 * import { db } from "../../../db"
 *
 * export default NextAuth({
 *   adapter: KyselyAdapter(db),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 * ### Configure Kysely
 * Kysely's constructor requires a database interface that contains an entry with an interface for each of your tables. You can define these types manually, or use `kysely-codegen` / `prisma-kysely` to automatically generate them.
 *
 * This adapter also exports a wrapper around the original Kysely class, `AuthedKysely`, that can be used to provide an additional level of type-safety. While using it isn't required, it is recommended as it will verify that the database interface has all the fields that Auth.js requires.
 *
 * ```ts title="db/index.ts"
 * import type { GeneratedAlways } from "kysely"
 * import { PostgresDialect } from "kysely"
 * import { Pool } from "pg"
 * import { AuthedKysely } from "@next-auth/kysely-adapter"
 *
 * interface User {
 *   id: GeneratedAlways<string>
 *   name: string | null
 *   email: string
 *   emailVerified: Date | null
 *   image: string | null
 * }
 *
 * interface Account {
 *   id: GeneratedAlways<string>
 *   userId: string
 *   type: string
 *   provider: string
 *   providerAccountId: string
 *   refresh_token: string | null
 *   access_token: string | null
 *   expires_at: number | null
 *   token_type: string | null
 *   scope: string | null
 *   id_token: string | null
 *   session_state: string | null
 *   oauth_token_secret: string | null
 *   oauth_token: string | null
 * }
 *
 * interface Session {
 *   id: GeneratedAlways<string>
 *   userId: string
 *   sessionToken: string
 *   expires: Date
 * }
 *
 * interface VerificationToken {
 *   identifier: string
 *   token: string
 *   expires: Date
 * }
 *
 * interface Database {
 *   User: User
 *   Account: Account
 *   Session: Session
 *   VerificationToken: VerificationToken
 * }
 *
 * export const db = new AuthedKysely<Database>({
 *   dialect: new PostgresDialect({
 *     pool: new Pool({
 *       host: process.env.DATABASE_HOST,
 *       database: process.env.DATABASE_NAME,
 *       user: process.env.DATABASE_USER,
 *       password: process.env.DATABASE_PASSWORD,
 *     }),
 *   }),
 * })
```
 *
 *
 * :::note
 * An alternative to manually defining types is generating them from the database schema using [kysely-codegen](https://github.com/RobinBlomberg/kysely-codegen), or from Prisma schemas using [prisma-kysely](https://github.com/valtyr/prisma-kysely). When using generated types with `AuthedKysely`, import `Codegen` and pass it as the second generic arg:
 * ```ts
 * import type { Codegen } from "@next-auth/kysely-adapter"
 * new AuthedKysely<Database, Codegen>(...)
 * ```
 * :::
 * ### Schema
 * ```ts title="db/migrations/001_create_db.ts"
 * import { Kysely, sql } from "kysely"
 *
 * export async function up(db: Kysely<any>): Promise<void> {
 *   await db.schema
 *     .createTable("User")
 *     .addColumn("id", "uuid", (col) =>
 *       col.primaryKey().defaultTo(sql`gen_random_uuid()`)
 *     )
 *     .addColumn("name", "text")
 *     .addColumn("email", "text", (col) => col.unique().notNull())
 *     .addColumn("emailVerified", "timestamptz")
 *     .addColumn("image", "text")
 *     .execute()
 *
 *   await db.schema
 *     .createTable("Account")
 *     .addColumn("id", "uuid", (col) =>
 *       col.primaryKey().defaultTo(sql`gen_random_uuid()`)
 *     )
 *     .addColumn("userId", "uuid", (col) =>
 *       col.references("User.id").onDelete("cascade").notNull()
 *     )
 *     .addColumn("type", "text", (col) => col.notNull())
 *     .addColumn("provider", "text", (col) => col.notNull())
 *     .addColumn("providerAccountId", "text", (col) => col.notNull())
 *     .addColumn("refresh_token", "text")
 *     .addColumn("access_token", "text")
 *     .addColumn("expires_at", "bigint")
 *     .addColumn("token_type", "text")
 *     .addColumn("scope", "text")
 *     .addColumn("id_token", "text")
 *     .addColumn("session_state", "text")
 *     .addColumn("oauth_token_secret", "text")
 *     .addColumn("oauth_token", "text")
 *     .execute()
 *
 *   await db.schema
 *     .createTable("Session")
 *     .addColumn("id", "uuid", (col) =>
 *       col.primaryKey().defaultTo(sql`gen_random_uuid()`)
 *     )
 *     .addColumn("userId", "uuid", (col) =>
 *       col.references("User.id").onDelete("cascade").notNull()
 *     )
 *     .addColumn("sessionToken", "text", (col) => col.notNull().unique())
 *     .addColumn("expires", "timestamptz", (col) => col.notNull())
 *     .execute()
 *
 *   await db.schema
 *     .createTable("VerificationToken")
 *     .addColumn("identifier", "text", (col) => col.notNull())
 *     .addColumn("token", "text", (col) => col.notNull().unique())
 *     .addColumn("expires", "timestamptz", (col) => col.notNull())
 *     .execute()
 *
 *   await db.schema
 *     .createIndex("Account_userId_index")
 *     .on("Account")
 *     .column("userId")
 *     .execute()
 *
 *   await db.schema
 *     .createIndex("Session_userId_index")
 *     .on("Session")
 *     .column("userId")
 *     .execute()
 * }
 *
 * export async function down(db: Kysely<any>): Promise<void> {
 *   await db.schema.dropTable("Account").ifExists().execute()
 *   await db.schema.dropTable("Session").ifExists().execute()
 *   await db.schema.dropTable("User").ifExists().execute()
 *   await db.schema.dropTable("VerificationToken").ifExists().execute()
 * }
 * ```
 * > This schema is adapted for use in Kysely and is based upon our main [schema](/reference/adapters/models).
 *
 * For more information about creating and running migrations with Kysely, refer to the [Kysely migrations documentation](https://kysely.dev/docs/migrations).
 * ## Naming conventions
 * If mixed snake_case and camelCase column names is an issue for you and/or your underlying database system, we recommend using Kysely's `CamelCasePlugin` ([see the documentation here](https://kysely-org.github.io/kysely/classes/CamelCasePlugin.html)) feature to change the field names. This won't affect NextAuth.js, but will allow you to have consistent casing when using Kysely.
 */
export function KyselyAdapter(db: Kysely<Database>): Adapter {
  const adapter = db.getExecutor().adapter
  const supportsReturning = adapter.supportsReturning
  const storeDatesAsISOStrings = adapter instanceof SqliteAdapter

  /** Helper function to return the passed in object and its specified prop
   * as an ISO string if SQLite is being used.
   **/
  function coerceInputData<
    T extends Partial<Record<K, Date | null>>,
    K extends keyof T
  >(data: T, key: K) {
    const value = data[key]
    return {
      ...data,
      [key]: value && storeDatesAsISOStrings ? value.toISOString() : value,
    }
  }

  /**
   * Helper function to return the passed in object and its specified prop as a date.
   * Necessary because SQLite has no date type so we store dates as ISO strings.
   **/
  function coerceReturnData<T extends Partial<ReturnData>, K extends keyof T>(
    data: T,
    key: K
  ): Omit<T, K> & Record<K, Date>
  function coerceReturnData<
    T extends Partial<ReturnData<null>>,
    K extends keyof T
  >(data: T, key: K): Omit<T, K> & Record<K, Date | null>
  function coerceReturnData<
    T extends Partial<ReturnData<null>>,
    K extends keyof T
  >(data: T, key: K) {
    const value = data[key]
    return Object.assign(data, {
      [key]: value && typeof value === "string" ? new Date(value) : value,
    })
  }

  return {
    async createUser(data) {
      const userData = coerceInputData(data, "emailVerified")
      const query = db.insertInto("User").values(userData)
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom("User")
              .selectAll()
              .where("email", "=", `${userData.email}`)
              .executeTakeFirstOrThrow()
          })
      return coerceReturnData(result, "emailVerified")
    },
    async getUser(id) {
      const result =
        (await db
          .selectFrom("User")
          .selectAll()
          .where("id", "=", id)
          .executeTakeFirst()) ?? null
      if (!result) return null
      return coerceReturnData(result, "emailVerified")
    },
    async getUserByEmail(email) {
      const result =
        (await db
          .selectFrom("User")
          .selectAll()
          .where("email", "=", email)
          .executeTakeFirst()) ?? null
      if (!result) return null
      return coerceReturnData(result, "emailVerified")
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result =
        (await db
          .selectFrom("User")
          .innerJoin("Account", "User.id", "Account.userId")
          .selectAll("User")
          .where("Account.providerAccountId", "=", providerAccountId)
          .where("Account.provider", "=", provider)
          .executeTakeFirst()) ?? null
      if (!result) return null
      return coerceReturnData(result, "emailVerified")
    },
    async updateUser({ id, ...user }) {
      if (!id) throw new Error("User not found")
      const userData = coerceInputData(user, "emailVerified")
      const query = db.updateTable("User").set(userData).where("id", "=", id)
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom("User")
              .selectAll()
              .where("id", "=", id)
              .executeTakeFirstOrThrow()
          })
      return coerceReturnData(result, "emailVerified")
    },
    async deleteUser(userId) {
      await db.deleteFrom("User").where("User.id", "=", userId).execute()
    },
    async linkAccount(account) {
      await db.insertInto("Account").values(account).executeTakeFirstOrThrow()
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom("Account")
        .where("Account.providerAccountId", "=", providerAccountId)
        .where("Account.provider", "=", provider)
        .executeTakeFirstOrThrow()
    },
    async createSession(data) {
      const sessionData = coerceInputData(data, "expires")
      const query = db.insertInto("Session").values(sessionData)
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await (async () => {
            await query.executeTakeFirstOrThrow()
            return await db
              .selectFrom("Session")
              .selectAll()
              .where("sessionToken", "=", sessionData.sessionToken)
              .executeTakeFirstOrThrow()
          })()
      return coerceReturnData(result, "expires")
    },
    async getSessionAndUser(sessionTokenArg) {
      const result = await db
        .selectFrom("Session")
        .innerJoin("User", "User.id", "Session.userId")
        .selectAll("User")
        .select([
          "Session.id as sessionId",
          "Session.userId",
          "Session.sessionToken",
          "Session.expires",
        ])
        .where("Session.sessionToken", "=", sessionTokenArg)
        .executeTakeFirst()
      if (!result) return null
      const { sessionId: id, userId, sessionToken, expires, ...user } = result
      return {
        user: coerceReturnData({ ...user }, "emailVerified"),
        session: coerceReturnData(
          { id, userId, sessionToken, expires },
          "expires"
        ),
      }
    },
    async updateSession(session) {
      const sessionData = coerceInputData(session, "expires")
      const query = db
        .updateTable("Session")
        .set(sessionData)
        .where("Session.sessionToken", "=", session.sessionToken)
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom("Session")
              .selectAll()
              .where("Session.sessionToken", "=", sessionData.sessionToken)
              .executeTakeFirstOrThrow()
          })
      return coerceReturnData(result, "expires")
    },
    async deleteSession(sessionToken) {
      await db
        .deleteFrom("Session")
        .where("Session.sessionToken", "=", sessionToken)
        .executeTakeFirstOrThrow()
    },
    async createVerificationToken(verificationToken) {
      const verificationTokenData = coerceInputData(
        verificationToken,
        "expires"
      )
      const query = db
        .insertInto("VerificationToken")
        .values(verificationTokenData)
      const result = supportsReturning
        ? await query.returningAll().executeTakeFirstOrThrow()
        : await query.executeTakeFirstOrThrow().then(async () => {
            return await db
              .selectFrom("VerificationToken")
              .selectAll()
              .where("token", "=", verificationTokenData.token)
              .executeTakeFirstOrThrow()
          })
      return coerceReturnData(result, "expires")
    },
    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom("VerificationToken")
        .where("VerificationToken.token", "=", token)
        .where("VerificationToken.identifier", "=", identifier)
      const result = supportsReturning
        ? (await query.returningAll().executeTakeFirst()) ?? null
        : await db
            .selectFrom("VerificationToken")
            .selectAll()
            .where("token", "=", token)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst()
              return res
            })
      if (!result) return null
      return coerceReturnData(result, "expires")
    },
  }
}

/**
 * Wrapper over the original `Kysely` class in order to validate the passed in
 * database interface. A regular Kysely instance may also be used, but wrapping
 * it ensures the database interface implements the fields that Auth.js
 * requires. When used with `kysely-codegen`, the `Codegen` type can be passed as
 * the second generic argument. The generated types will be used, and
 * `AuthedKysely` will only verify that the correct fields exist.
 **/
export class AuthedKysely<DB extends T, T = Database> extends Kysely<DB> {}

export type Codegen = {
  [K in keyof Database]: { [J in keyof Database[K]]: unknown }
}
