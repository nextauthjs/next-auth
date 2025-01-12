/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://kysely.dev/">Kysely</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://kysely.dev/">
 *   <img style={{display: "block"}} src="/img/adapters/kysely.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install kysely @auth/kysely-adapter
 * ```
 *
 * @module @auth/kysely-adapter
 */

import { Kysely, SqliteAdapter } from "kysely"

import {
  type Adapter,
  type AdapterUser,
  type AdapterAccount,
  type AdapterSession,
  type VerificationToken,
  isDate,
} from "@auth/core/adapters"

export interface Database {
  User: AdapterUser
  Account: AdapterAccount
  Session: AdapterSession
  VerificationToken: VerificationToken
}

export const format = {
  from<T>(object?: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (isDate(value)) newObject[key] = new Date(value)
      else newObject[key] = value
    }
    return newObject as T
  },
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      newObject[key] = value instanceof Date ? value.toISOString() : value
    return newObject as T
  },
}

export function KyselyAdapter(db: Kysely<Database>): Adapter {
  const { adapter } = db.getExecutor()
  const { supportsReturning } = adapter
  const isSqlite = adapter instanceof SqliteAdapter
  /** If the database is SQLite, turn dates into an ISO string  */
  const to = isSqlite ? format.to : <T>(x: T) => x as T
  /** If the database is SQLite, turn ISO strings into dates */
  const from = isSqlite ? format.from : <T>(x: T) => x as T
  return {
    async createUser(data) {
      const user = { ...data, id: crypto.randomUUID() }
      await db.insertInto("User").values(to(user)).executeTakeFirstOrThrow()
      return user
    },
    async getUser(id) {
      const result = await db
        .selectFrom("User")
        .selectAll()
        .where("id", "=", id)
        .executeTakeFirst()
      if (!result) return null
      return from(result)
    },
    async getUserByEmail(email) {
      const result = await db
        .selectFrom("User")
        .selectAll()
        .where("email", "=", email)
        .executeTakeFirst()
      if (!result) return null
      return from(result)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom("User")
        .innerJoin("Account", "User.id", "Account.userId")
        .selectAll("User")
        .where("Account.providerAccountId", "=", providerAccountId)
        .where("Account.provider", "=", provider)
        .executeTakeFirst()
      if (!result) return null
      return from(result)
    },
    async updateUser({ id, ...user }) {
      const userData = to(user)
      const query = db.updateTable("User").set(userData).where("id", "=", id)
      const result = supportsReturning
        ? query.returningAll().executeTakeFirstOrThrow()
        : query
            .executeTakeFirstOrThrow()
            .then(() =>
              db
                .selectFrom("User")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirstOrThrow()
            )
      return from(await result)
    },
    async deleteUser(userId) {
      await db
        .deleteFrom("User")
        .where("User.id", "=", userId)
        .executeTakeFirst()
    },
    async linkAccount(account) {
      await db
        .insertInto("Account")
        .values(to(account))
        .executeTakeFirstOrThrow()
      return account
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom("Account")
        .where("Account.providerAccountId", "=", providerAccountId)
        .where("Account.provider", "=", provider)
        .executeTakeFirstOrThrow()
    },
    async createSession(session) {
      await db.insertInto("Session").values(to(session)).execute()
      return session
    },
    async getSessionAndUser(sessionToken) {
      const result = await db
        .selectFrom("Session")
        .innerJoin("User", "User.id", "Session.userId")
        .selectAll("User")
        .select(["Session.expires", "Session.userId"])
        .where("Session.sessionToken", "=", sessionToken)
        .executeTakeFirst()
      if (!result) return null
      const { userId, expires, ...user } = result
      const session = { sessionToken, userId, expires }
      return { user: from(user), session: from(session) }
    },
    async updateSession(session) {
      const sessionData = to(session)
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
      return from(result)
    },
    async deleteSession(sessionToken) {
      await db
        .deleteFrom("Session")
        .where("Session.sessionToken", "=", sessionToken)
        .executeTakeFirstOrThrow()
    },
    async createVerificationToken(data) {
      await db.insertInto("VerificationToken").values(to(data)).execute()
      return data
    },
    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom("VerificationToken")
        .where("VerificationToken.token", "=", token)
        .where("VerificationToken.identifier", "=", identifier)

      const result = supportsReturning
        ? await query.returningAll().executeTakeFirst()
        : await db
            .selectFrom("VerificationToken")
            .selectAll()
            .where("token", "=", token)
            .where("identifier", "=", identifier)
            .executeTakeFirst()
            .then(async (res) => {
              await query.executeTakeFirst()
              return res
            })
      if (!result) return null
      return from(result)
    },
  }
}

/**
 * Wrapper over the original `Kysely` class in order to validate the passed in
 * database interface. A regular Kysely instance may also be used, but wrapping
 * it ensures the database interface implements the fields that Auth.js
 * requires. When used with `kysely-codegen`, the `Codegen` type can be passed as
 * the second generic argument. The generated types will be used, and
 * `KyselyAuth` will only verify that the correct fields exist.
 */
export class KyselyAuth<DB extends T, T = Database> extends Kysely<DB> {}

export type Codegen = {
  [K in keyof Database]: { [J in keyof Database[K]]: unknown }
}
