import { Kysely, SqliteAdapter } from "kysely"
import type { Adapter } from "next-auth/adapters"
import type { Database } from "./database"

/**
 * Wrapper over the original Kysely class in order to validate
 * the passed in database interface. A regular Kysely instance may
 * also be used, but wrapping it ensures the database interface
 * implements the fields that NextAuth requires.
 **/
export class AuthedKysely<DB extends Database> extends Kysely<DB> {}

export function KyselyAdapter(db: Kysely<Database>): Adapter {
  const adapter = db.getExecutor().adapter
  const supportsReturning = adapter.supportsReturning
  const storeDatesAsISOStrings = adapter instanceof SqliteAdapter

  return {
    async createUser(data) {
      const userData = storeDatesAsISOStrings
        ? { ...data, emailVerified: (data.emailVerified as Date).toISOString() }
        : data
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

      return Object.assign(result, {
        emailVerified:
          typeof result.emailVerified === "string"
            ? new Date(result.emailVerified)
            : result.emailVerified,
      })
    },
    async getUser(id) {
      const result =
        (await db
          .selectFrom("User")
          .selectAll()
          .where("id", "=", id)
          .executeTakeFirst()) ?? null

      if (!result) return null
      return Object.assign(result, {
        emailVerified:
          typeof result.emailVerified === "string"
            ? new Date(result.emailVerified)
            : result.emailVerified,
      })
    },
    async getUserByEmail(email) {
      const result =
        (await db
          .selectFrom("User")
          .selectAll()
          .where("email", "=", email)
          .executeTakeFirst()) ?? null

      if (!result) return null
      return Object.assign(result, {
        emailVerified:
          typeof result.emailVerified === "string"
            ? new Date(result.emailVerified)
            : result.emailVerified,
      })
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
      return Object.assign(result, {
        emailVerified:
          typeof result.emailVerified === "string"
            ? new Date(result.emailVerified)
            : result.emailVerified,
      })
    },
    async updateUser({ id, ...user }) {
      if (!id) throw new Error("User not found")
      const userData = storeDatesAsISOStrings
        ? { ...user, emailVerified: user.emailVerified?.toISOString() }
        : user
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

      return Object.assign(result, {
        emailVerified:
          typeof result.emailVerified === "string"
            ? new Date(result.emailVerified)
            : result.emailVerified,
      })
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
      const sessionData = storeDatesAsISOStrings
        ? { ...data, expires: data.expires.toISOString() }
        : data
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

      return Object.assign(result, {
        expires:
          typeof result.expires === "string"
            ? new Date(result.expires)
            : result.expires,
      })
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
        user: {
          ...user,
          emailVerified:
            typeof user.emailVerified === "string"
              ? new Date(user.emailVerified)
              : user.emailVerified,
        },
        session: {
          id,
          userId,
          sessionToken,
          expires: typeof expires === "string" ? new Date(expires) : expires,
        },
      }
    },
    async updateSession(session) {
      const sessionData = storeDatesAsISOStrings
        ? {
            ...session,
            expires: session.expires
              ? session.expires.toISOString()
              : session.expires,
          }
        : session
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

      return Object.assign(result, {
        expires:
          typeof result.expires === "string"
            ? new Date(result.expires)
            : result.expires,
      })
    },
    async deleteSession(sessionToken) {
      await db
        .deleteFrom("Session")
        .where("Session.sessionToken", "=", sessionToken)
        .executeTakeFirstOrThrow()
    },
    async createVerificationToken(verificationToken) {
      const verificationTokenData = supportsReturning
        ? {
            ...verificationToken,
            expires: verificationToken.expires.toISOString(),
          }
        : verificationToken
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

      return Object.assign(result, {
        expires:
          typeof result.expires === "string"
            ? new Date(result.expires)
            : result.expires,
      })
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
      return Object.assign(result, {
        expires:
          typeof result.expires === "string"
            ? new Date(result.expires)
            : result.expires,
      })
    },
  }
}
