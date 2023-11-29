import { runBasicTests } from "../../../adapter-test"
import { DrizzleAdapter } from "../../src"
import { db, accounts, sessions, users, verificationTokens } from "./schema"
import { eq, and } from "drizzle-orm"

globalThis.crypto ??= require("node:crypto").webcrypto

runBasicTests({
  adapter: DrizzleAdapter(db),
  db: {
    connect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(accounts),
        db.delete(verificationTokens),
        db.delete(users),
      ])
    },
    disconnect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(accounts),
        db.delete(verificationTokens),
        db.delete(users),
      ])
    },
    user: async (id) =>
      (await db.select().from(users).where(eq(users.id, id)).get()) ?? null,
    session: async (sessionToken) =>
      (await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .get()) ?? null,
    account: async (provider_providerAccountId) => {
      return (
        (await db
          .select()
          .from(accounts)
          .where(
            eq(
              accounts.providerAccountId,
              provider_providerAccountId.providerAccountId
            )
          )
          .get()) ?? null
      )
    },
    verificationToken: (identifier_token) =>
      db
        .select()
        .from(verificationTokens)
        .where(
          and(
            eq(verificationTokens.token, identifier_token.token),
            eq(verificationTokens.identifier, identifier_token.identifier)
          )
        )
        .get() ?? null,
  },
})
