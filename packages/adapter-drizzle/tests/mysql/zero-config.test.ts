import { runBasicTests } from "../../../adapter-test"
import { DrizzleAdapter } from "../../src"
import {
  db,
  accounts,
  sessions,
  users,
  verificationTokens,
} from "../../src/mysql"
import { eq, and } from "drizzle-orm"

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
    user: (id) => db.select().from(users).where(eq(users.id, id)).then(res => res[0]) ?? null,
    // .where(eq(users.id, id)) ?? null,
    session: (sessionToken) =>
      db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken)).then(res => res[0]) ?? null,
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
          ).then(res => res[0]) ?? null
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
        ).then(res => res[0]) ?? null,
  },
})
