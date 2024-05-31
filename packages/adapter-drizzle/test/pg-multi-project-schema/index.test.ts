import { and, eq } from "drizzle-orm"
import { runBasicTests } from "utils/adapter"
import { DrizzleAdapter } from "../../src"
import { fixtures } from "../fixtures"
import {
  accounts,
  authenticators,
  db,
  sessions,
  users,
  verificationTokens,
} from "./schema"

runBasicTests({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  fixtures,
  testWebAuthnMethods: true,
  db: {
    connect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(accounts),
        db.delete(verificationTokens),
        db.delete(users),
        db.delete(authenticators),
      ])
    },
    disconnect: async () => {
      await Promise.all([
        db.delete(sessions),
        db.delete(accounts),
        db.delete(verificationTokens),
        db.delete(users),
        db.delete(authenticators),
      ])
    },
    user: (id) =>
      db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .then((res) => res[0] ?? null),
    session: (sessionToken) =>
      db
        .select()
        .from(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .then((res) => res[0] ?? null),
    account: (provider_providerAccountId) =>
      db
        .select()
        .from(accounts)
        .where(
          eq(
            accounts.providerAccountId,
            provider_providerAccountId.providerAccountId
          )
        )
        .then((res) => res[0] ?? null),
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
        .then((res) => res[0]) ?? null,
    authenticator: (credentialID) =>
      db
        .select()
        .from(authenticators)
        .where(eq(authenticators.credentialID, credentialID))
        .then((res) => res[0]),
  },
})
