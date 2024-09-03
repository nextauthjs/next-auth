import type {
  Adapter,
  AdapterAccount,
  AdapterUser,
  VerificationToken as VerificationTokenT,
  AdapterSession,
} from "@auth/core/adapters"
import { repo } from "remult"
import { Account, User, VerificationToken } from "./entities.js"
import { Session } from "./entities.js"

export const RemultAdapter: () => Adapter = () => {
  return {
    async createVerificationToken(
      verificationToken: VerificationTokenT
    ): Promise<VerificationTokenT> {
      await repo(VerificationToken).insert(verificationToken)
      return verificationToken
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }) {
      const v = await repo(VerificationToken).findFirst({ identifier, token })
      if (!v) return null
      if (v && v.identifier !== identifier) {
        return null
      }
      await repo(VerificationToken).delete({ identifier, token })
      return v!
    },
    async createUser(user) {
      return await repo(User).insert(user)
    },
    async getUser(id) {
      if (id) {
        const u = await repo(User).findFirst({ id })
        if (u) {
          return u
        }
      }
      return null
    },
    async getUserByEmail(email) {
      if (email) {
        const u = await repo(User).findFirst({ email })
        if (u) {
          return u
        }
      }
      return null
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const a = await repo(Account).findFirst(
        { provider, providerAccountId }
        // { include: { user: true } }
      )
      if (a) {
        return (await repo(User).findFirst({ id: a?.userId })) ?? null
      }
      return null
    },
    async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
      if (user.id) {
        return await repo(User).update(user.id, user)
      }
      return user as Promise<AdapterUser>
    },
    async linkAccount(account) {
      const t = await repo(Account).insert(account)
      return t as unknown as AdapterAccount
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error(`userId is undef in createSession`)
      }
      return await repo(Session).insert({ sessionToken, userId, expires })
    },

    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession
      user: AdapterUser
    } | null> {
      if (sessionToken === undefined) {
        return null
      }
      const result1 = await repo(Session).findFirst({ sessionToken })

      if (!result1) {
        return null
      }
      const session: AdapterSession = result1

      const result2 = await repo(User).findFirst({ id: session.userId })
      if (!result2) {
        return null
      }
      const user = result2
      return {
        session,
        user,
      }
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session
      const result1 = await repo(Session).findFirst({ sessionToken })
      if (!result1) {
        return null
      }
      const originalSession: AdapterSession = result1

      const newSession: AdapterSession = {
        ...originalSession,
        ...session,
      }
      await repo(Session).updateMany({
        where: { sessionToken: newSession.sessionToken },
        set: { expires: newSession.expires },
      })
      return newSession
    },
    async deleteSession(sessionToken) {
      await repo(Session).delete({ sessionToken })
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount
      await repo(Account).deleteMany({ where: { provider, providerAccountId } })
    },
    async deleteUser(userId: string) {
      await repo(User).delete({ id: userId })
      await repo(Session).deleteMany({ where: { userId } })
      await repo(Account).deleteMany({ where: { userId } })
    },
  }
}
