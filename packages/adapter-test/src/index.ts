import {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
  AdapterAccount,
} from "@auth/core/adapters"

export function TestAdapter(): Adapter {
  let user: AdapterUser | null = null
  let session: AdapterSession | null = null
  let account: AdapterAccount | null = null
  let verificationToken: VerificationToken | null = null
  return {
    async createUser(data: AdapterUser) {
      user = data
      return user
    },
    async getUser(userId: string) {
      return user && user.id === userId ? user : null
    },
    async getUserByEmail(email: string) {
      return user && user.email === email ? user : null
    },
    async createSession(data: {
      sessionToken: string
      userId: string
      expires: Date
    }) {
      session = {
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: data.expires,
      }
      return Promise.resolve(session)
    },
    async getSessionAndUser(sessionToken: string) {
      const result =
        session && session.sessionToken === sessionToken
          ? { session: session!, user: user! }
          : null
      return Promise.resolve(result)
    },
    async updateUser(data: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      if (user?.id !== data.id) {
        throw new Error("No user id.")
      }

      user = { ...user, ...data }
      return user
    },
    async updateSession(
      data: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      if (!session || session.sessionToken !== data.sessionToken) return null

      session = { ...session, ...data }
      return session
    },
    async linkAccount(data: AdapterAccount) {
      account = data
      return Promise.resolve(account)
    },
    async getUserByAccount(
      input: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      return account &&
        account.provider === input.provider &&
        account.providerAccountId === input.providerAccountId
        ? user
        : null
    },
    async deleteSession(sessionToken: string) {
      if (!session || session.sessionToken !== sessionToken) return null
      session = null
    },
    async createVerificationToken(data: VerificationToken) {
      verificationToken = data
      return verificationToken
    },
    async useVerificationToken(params: { identifier: string; token: string }) {
      if (!verificationToken) return null
      if (
        verificationToken.identifier === params.identifier &&
        verificationToken.token === params.token
      ) {
        verificationToken = null
        return verificationToken
      }

      return null
    },
    async deleteUser(id: string) {
      if (user?.id !== id) return undefined
      user = null
    },
    async unlinkAccount(
      params: Pick<AdapterAccount, "provider" | "providerAccountId">
    ) {
      if (
        !account ||
        account.provider !== params.provider ||
        account.providerAccountId !== params.providerAccountId
      ) {
        return undefined
      }
      account = null
    },
  }
}
