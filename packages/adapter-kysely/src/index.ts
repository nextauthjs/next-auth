import { Kysely, SqliteAdapter } from "kysely"
import type { Adapter } from "next-auth/adapters"
import type { Database } from "./database"

type ReturnData<T = never> = Record<string, Date | string | T>

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
 * Wrapper over the original Kysely class in order to validate the passed in
 * database interface. A regular Kysely instance may also be used, but wrapping
 * it ensures the database interface implements the fields that NextAuth
 * requires. When used with kysely-codegen, the CodeGen type can be passed as
 * the second generic argument. The generated types will be used, and
 * AuthedKysely will only verify that the correct fields exist.
 **/
export class AuthedKysely<DB extends T, T = Database> extends Kysely<DB> {}

export type CodeGen = {
  [K in keyof Database]: { [J in keyof Database[K]]: unknown }
}
