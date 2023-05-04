import { randomUUID, runBasicTests } from "@next-auth/adapter-test"
import { DrizzleAdapterMySQL } from "../src"
import { users, accounts, sessions, verificationTokens } from '../src/schema'
import { db } from '../src/client'
import { eq, and } from 'drizzle-orm/expressions';


runBasicTests({
  adapter: DrizzleAdapterMySQL(db),
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
    user: (id) => db
      .select()
      .from(users)
      .where(eq(users.id, id)) ?? null,
    // .where(eq(users.id, id)) ?? null,
    session: (sessionToken) => db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, sessionToken))
      ?? null,
    account: (provider_providerAccountId) => {
      return db
        .select()
        .from(accounts)
        .where(
          eq(
            accounts.providerAccountId,
            provider_providerAccountId.providerAccountId
          )
        )

        ?? null
    },
    verificationToken: (identifier_token) => db
      .select()
      .from(verificationTokens)
      .where(
        and(
          eq(
            verificationTokens.token,
            identifier_token.token
          ),
          eq(
            verificationTokens.identifier,
            identifier_token.identifier
          )
        )
      ) ?? null,
  },
})
