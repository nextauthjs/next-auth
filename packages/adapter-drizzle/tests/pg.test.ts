import { randomUUID, runBasicTests } from "@next-auth/adapter-test"
import { DrizzleAdapterPg } from "../src/pg"
import {
  db,
  users,
  accounts,
  sessions,
  verificationTokens,
} from "../src/pg/schema"
import { eq, and } from "drizzle-orm"

runBasicTests({
  adapter: DrizzleAdapterPg(db, {
    users,
    accounts,
    sessions,
    verificationTokens,
  }),
  db: {
    id() {
      return randomUUID()
    },
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
    user: (id) => db.select().from(users).where(eq(users.id, id)) ?? null,
    // .where(eq(users.id, id)) ?? null,
    session: (sessionToken) =>
      db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken)) ?? null,
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
          ) ?? null
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
        ) ?? null,
  },
})
