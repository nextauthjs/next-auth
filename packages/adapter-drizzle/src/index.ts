
import { db, accounts, users, sessions, verificationTokens } from './schema'
import { and, eq } from 'drizzle-orm/expressions'
import type { Adapter } from "next-auth/adapters"

export function DrizzleAdapter(d: typeof db): Adapter {
  return {
    createUser: (data) => {
      return d
        .insert(users)
        .values({ ...data, id: "123" })
        .returning()
        .get()
    },
    getUser: (data) => {
      return d
        .select()
        .from(users)
        .where(eq(users.id, data))
        .get() ?? null
    },
    getUserByEmail: (data) => {
      return d
        .select()
        .from(users)
        .where(eq(users.email, data))
        .get() ?? null
    },
    createSession: (data) => {
      return d
        .insert(sessions)
        .values(data)
        .returning()
        .get()
    },
    getSessionAndUser: (data) => {
      return d.select({
        session: sessions,
        user: users
      })
        .from(sessions)
        .where(eq(sessions.sessionToken, data))
        .innerJoin(users, eq(users.id, sessions.userId))
        .get() ?? null
    },
    updateUser: (data) => {
      return d
        .update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning()
        .get()
    },
    updateSession: (data) => {
      return d
        .update(sessions)
        .set(data)
        .where(eq(sessions.sessionToken, data.sessionToken))
        .returning()
        .get()
    },
    linkAccount: (rawAccount) => {
      const updatedAccount = d
        .insert(accounts)
        .values(rawAccount)
        .returning()
        .get()

      const account: ReturnType<Adapter["linkAccount"]> = {
        ...updatedAccount,
        access_token: updatedAccount.access_token ?? undefined,
        token_type: updatedAccount.token_type ?? undefined,
        id_token: updatedAccount.id_token ?? undefined,
        refresh_token: updatedAccount.refresh_token ?? undefined,
        scope: updatedAccount.scope ?? undefined,
        expires_at: updatedAccount.expires_at ?? undefined,
        session_state: updatedAccount.session_state ?? undefined
      }

      return account
    },
    getUserByAccount: (account) => {
      return d.select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
        image: users.image,
        name: users.name
      })
        .from(users)
        .innerJoin(accounts, (
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider)
          )
        ))
        .get() ?? null
    }
    ,
    deleteSession: (sessionToken) => {
      return d
        .delete(sessions)
        .where(eq(sessions.sessionToken, sessionToken))
        .returning()
        .get() ?? null
    },
    createVerificationToken: (token) => {
      return d
        .insert(verificationTokens)
        .values(token)
        .returning()
        .get()
    },
    useVerificationToken: (token) => {
      try {
        return d
          .delete(verificationTokens)
          .where(
            and(
              eq(verificationTokens.identifier, token.identifier),
              eq(verificationTokens.token, token.token)
            )
          )
          .returning()
          .get() ?? null

      } catch (err) {
        throw new Error("No verification token found.")
      }
    },
    deleteUser: (id) => {
      return d
        .delete(users)
        .where(eq(users.id, id))
        .returning()
        .get()
    },
    unlinkAccount: (account) => {
      d.delete(accounts)
        .where(
          and(
            eq(accounts.providerAccountId, account.providerAccountId),
            eq(accounts.provider, account.provider),
          )
        )
        .run()

      return undefined
    }
  }
}
