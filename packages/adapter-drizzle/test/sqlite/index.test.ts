import { runBasicTests } from "utils/adapter"
import { DrizzleAdapter } from "../../src"
import {
  db,
  accountsTable as accounts,
  sessionsTable as sessions,
  usersTable as users,
  verificationTokensTable as verificationTokens,
} from "./schema"
import { eq, and } from "drizzle-orm"
import { fixtures } from "../fixtures"

runBasicTests({
  adapter: DrizzleAdapter(db),
  fixtures,
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
    user: (id) => db.select().from(users).where(eq(users.id, id)).get() ?? null,
    session: (sessionToken) =>
      db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .get() ?? null,
    account: (provider_providerAccountId) => {
      return (
        db
          .select()
          .from(accounts)
          .where(
            eq(
              accounts.providerAccountId,
              provider_providerAccountId.providerAccountId
            )
          )
          .get() ?? null
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
