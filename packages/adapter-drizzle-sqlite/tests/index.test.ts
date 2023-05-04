import { randomUUID, runBasicTests } from "@next-auth/adapter-test"
import { DrizzleAdapterSQLite } from "../src"
import { db, users, accounts, sessions, verificationTokens } from '../src/schema'
import { eq, and } from 'drizzle-orm';


runBasicTests({
  adapter: DrizzleAdapterSQLite(db),
  db: {
    id() {
      return randomUUID()
    },
    connect: async () => {
      await Promise.all([
        db.delete(sessions).run(),
        db.delete(accounts).run(),
        db.delete(verificationTokens).run(),
        db.delete(users).run(),
      ])
    },
    disconnect: async () => {
      await Promise.all([
        db.delete(sessions).run(),
        db.delete(accounts).run(),
        db.delete(verificationTokens).run(),
        db.delete(users).run(),
      ])
    },
    user: (id) => db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .get() ?? null,
    session: (sessionToken) => db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, sessionToken))
      .get() ?? null,
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
        .get()
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
      ).get() ?? null,
  },
})
