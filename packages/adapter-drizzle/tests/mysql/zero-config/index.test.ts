import { runBasicTests } from "../../../../adapter-test"
import { DrizzleAdapter } from "../../../src"
import { db, sessions, verificationTokens, customAccountsTable, customUsersTable } from './schema'
import { eq, and } from "drizzle-orm"

runBasicTests({
  adapter: DrizzleAdapter(db),
  db: {
    connect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(customAccountsTable),
        db.delete(verificationTokens),
        db.delete(customUsersTable),
      ])
    },
    disconnect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(customAccountsTable),
        db.delete(verificationTokens),
        db.delete(customUsersTable),
      ])
    },
    user: async (id) => {
      const user = await db
        .select()
        .from(customUsersTable)
        .where(eq(customUsersTable.id, id))
        .then(res => res[0] ?? null)
      return user
    },
    session: async (sessionToken) => {
      const session = await db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken)).then(res => res[0] ?? null)

      return session
    },
    account: (provider_providerAccountId) => {
      const account = db
        .select()
        .from(customAccountsTable)
        .where(
          eq(
            customAccountsTable.providerAccountId,
            provider_providerAccountId.providerAccountId
          )
        ).then(res => res[0] ?? null)
      return account
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
        ).then(res => res[0]) ?? null,
  },
})
