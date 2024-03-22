import { runBasicTests } from "utils/adapter"
import { DrizzleAdapter } from "../../src"
import {
  db,
  accounts,
  sessions,
  users,
  verificationTokens,
} from "./schema.libsql"
import { eq, and } from "drizzle-orm"

const orNull = <T>(x: T | null | undefined): NonNullable<T> | null => x ?? null

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
    user: (id) =>
      db.select().from(users).where(eq(users.id, id)).get().then(orNull),
    session: (sessionToken) =>
      db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .get()
        .then(orNull),
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
        .then(orNull)
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
