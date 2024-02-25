import {  ConvexHttpClient } from "convex/browser"
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser, VerificationToken,
} from "@auth/core/src/adapters"
import { Awaitable } from "vitest"
import { api } from "../convex/_generated/api"
import { Id } from "../convex/_generated/dataModel"

export function ConvexAdapter(client: ConvexHttpClient): Adapter {
  return {
    createUser(user: AdapterUser): Awaitable<AdapterUser> {
      return client.mutation(api.users.create, {
        email: user.email,
        emailVerified: user.emailVerified ? user.emailVerified.toISOString() : undefined,
        image: user.image ?? undefined,
        name: user.name ?? undefined,
      }).then((_id) => {
        if(!_id) throw new Error("Failed to create new user!")
        let temp = user
        temp.id = _id as string
        return temp
      })
    },
    getUser(id: string): Awaitable<AdapterUser | null> {
      return client.query(api.users.get, { id: id as Id<"users"> }).then((user) => {
        if(!user) return null
        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified ? new Date(user?.emailVerified) : undefined,
          image: user?.image,
        } as AdapterUser
      })
    },
    getUserByEmail(email: string): Awaitable<AdapterUser | null> {
      return client.query(api.users.getByEmail, {
        email
      }).then((user) => {
        if(!user) return null
        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified ? new Date(user?.emailVerified) : undefined,
          image: user?.image,
        } as AdapterUser
      })
    },
    getUserByAccount(providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Awaitable<AdapterUser | null> {
      return client.query(api.accounts.getUserByAccount, {
        providerAccountId: providerAccountId as unknown as string
      }).then((user) => {
        if(!user) return null
        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified ? new Date(user?.emailVerified) : undefined,
          image: user?.image,
        } as AdapterUser
      })
    },
    updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Awaitable<AdapterUser> {
      if(!user.email) throw new Error("User.email could not be found on ConvexAdapter.updateUser")
      return client.mutation(api.users.update, {
        id: user.id as Id<"users">,
        email: user.email,
        emailVerified: user?.emailVerified ? new Date(user?.emailVerified).toISOString() : undefined,
        image: user.image ?? undefined,
      }).then((user) => {
        if (!user) throw new Error("User not found but calling ConvexAdapter.updateUser")
        return {
          id: user?._id,
          name: user?.name,
          email: user?.email,
          emailVerified: user?.emailVerified ? new Date(user?.emailVerified) : undefined,
          image: user?.image,
        } as AdapterUser
      })
    },
    deleteUser(userId: string): Promise<void> | Awaitable<AdapterUser | null | undefined> {
      return client.mutation(api.users.deleteUser, {
        id: userId as Id<"users">
      })
    },
    linkAccount(account: AdapterAccount): Promise<void> {
      return client.mutation(api.accounts.create, {
        userId: account.userId as any,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refreshToken: account.refreshToken as string,
        accessToken: account.accessToken as string,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state as string,
      }).then(_id => {
      })
    },
    unlinkAccount(providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<void> {
      return client.mutation(api.accounts.deleteAccount, {
        providerAccountId: providerAccountId as unknown as string
      }).then((_) => {})
    },
    createSession({ userId, expires, sessionToken }): Awaitable<AdapterSession> {
      return client.mutation(api.sessions.create, {
        userId: userId as Id<"users">,
        expires: expires.toISOString(),
        sessionToken: sessionToken
      }).then((_id) => {
        return {
          sessionToken,
          userId,
          expires,
        } as AdapterSession
      })
    },
    getSessionAndUser(sessionToken: string): Awaitable<{ session: AdapterSession; user: AdapterUser } | null> {
      return client.query(api.sessions.getSessionAndUser, {
        sessionToken
      }).then((data) => {
        if(!data || !data.session || !data.user) return null
        return {
          session: {
            sessionToken: data.session.sessionToken,
            userId: data.session.userId as unknown as string,
            expires: new Date(data.session.expires!),
          } as AdapterSession,
          user: {
            id: data.user._id as unknown as string,
            name: data.user.name,
            email: data.user.email,
            emailVerified: data.user.emailVerified ? new Date(data.user.emailVerified) : undefined,
            image: data.user.image,
          } as AdapterUser
        }
      })
    },
    updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Awaitable<AdapterSession | null | undefined> {
      return client.mutation(api.sessions.updateSession, {
        sessionToken: session.sessionToken,
      })
    },
    deleteSession(sessionToken: string): Promise<void> | Awaitable<AdapterSession | null | undefined> {
      return client.mutation(api.sessions.deleteSession, {
        sessionToken
      })
    },
    createVerificationToken(verificationToken: VerificationToken): Awaitable<VerificationToken | null | undefined> {
      // todo - implement this
      return null
    },
    useVerificationToken(params: { identifier: string; token: string }): Awaitable<VerificationToken | null> {
      // todo - implement this
      return null
    },
  }
}