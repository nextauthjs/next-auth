import { Kysely } from "kysely"
import type { Adapter } from "next-auth/adapters"
import type { Database } from "./database"

export function KyselyAdapter(db: Kysely<Database>): Adapter {
  const supportsReturning = db.getExecutor().adapter.supportsReturning

  return {
    async createUser(data) {
      const query = db.insertInto("User").values(data)

      if (supportsReturning)
        return await query.returningAll().executeTakeFirstOrThrow()
      await query.executeTakeFirstOrThrow()
      return await db
        .selectFrom("User")
        .selectAll()
        .where("email", "=", `${data.email}`)
        .executeTakeFirstOrThrow()
    },
    async getUser(id) {
      return (
        (await db
          .selectFrom("User")
          .selectAll()
          .where("id", "=", id)
          .executeTakeFirst()) ?? null
      )
    },
    async getUserByEmail(email) {
      return (
        (await db
          .selectFrom("User")
          .selectAll()
          .where("email", "=", email)
          .executeTakeFirst()) ?? null
      )
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return (
        (await db
          .selectFrom("User")
          .innerJoin("Account", "User.id", "Account.userId")
          .selectAll("User")
          .where("Account.providerAccountId", "=", providerAccountId)
          .where("Account.provider", "=", provider)
          .executeTakeFirst()) ?? null
      )
    },
    async updateUser({ id, ...user }) {
      if (!id) throw new Error("User not found")
      const result = await db
        .updateTable("User")
        .set(user)
        .where("User.id", "=", id)
        .if(supportsReturning, (qb) => qb.returningAll())
        .executeTakeFirstOrThrow()

      if (supportsReturning) return result as Required<typeof result>
      return await db
        .selectFrom("User")
        .selectAll()
        .where("User.id", "=", id)
        .executeTakeFirstOrThrow()
    },
    async deleteUser(userId) {
      await db.deleteFrom("User").where("User.id", "=", userId).execute()
      return null
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
      const query = db.insertInto("Session").values(data)

      if (supportsReturning)
        return await query.returningAll().executeTakeFirstOrThrow()
      await query.executeTakeFirstOrThrow()
      return await db
        .selectFrom("Session")
        .selectAll()
        .where("sessionToken", "=", data.sessionToken)
        .executeTakeFirstOrThrow()
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
        user,
        session: {
          id,
          userId,
          sessionToken,
          expires,
        },
      }
    },
    async updateSession(session) {
      const result = await db
        .updateTable("Session")
        .set(session)
        .where("Session.sessionToken", "=", session.sessionToken)
        .if(supportsReturning, (qb) => qb.returningAll())
        .executeTakeFirstOrThrow()

      if (supportsReturning) return result as Required<typeof result>
      return await db
        .selectFrom("Session")
        .selectAll()
        .where("Session.sessionToken", "=", session.sessionToken)
        .executeTakeFirstOrThrow()
    },
    async deleteSession(sessionToken) {
      await db
        .deleteFrom("Session")
        .where("Session.sessionToken", "=", sessionToken)
        .executeTakeFirstOrThrow()
    },
    async createVerificationToken(verificationToken) {
      const query = db.insertInto("VerificationToken").values(verificationToken)
      if (supportsReturning)
        return await query.returningAll().executeTakeFirstOrThrow()
      await query.executeTakeFirstOrThrow()
      return await db
        .selectFrom("VerificationToken")
        .selectAll()
        .where("token", "=", verificationToken.token)
        .executeTakeFirstOrThrow()
    },
    async useVerificationToken({ identifier, token }) {
      const query = db
        .deleteFrom("VerificationToken")
        .where("VerificationToken.token", "=", token)
        .where("VerificationToken.identifier", "=", identifier)
      if (supportsReturning)
        return (await query.returningAll().executeTakeFirst()) ?? null

      const verificationToken = await db
        .selectFrom("VerificationToken")
        .selectAll()
        .where("token", "=", token)
        .executeTakeFirst()
      await query.execute()
      return verificationToken ?? null
    },
  }
}
