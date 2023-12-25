/**
 * Mock adapter for testing
 */

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
} from "@auth/core/adapters"
import type { Awaitable } from "@auth/core/types"

export const options = {
  baseKeyPrefix: "",
  accountKeyPrefix: "user:account:",
  accountByUserIdPrefix: "user:account:by-user-id:",
  emailKeyPrefix: "user:email:",
  sessionKeyPrefix: "user:session:",
  sessionByUserIdKeyPrefix: "user:session:by-user-id:",
  userKeyPrefix: "user:",
  verificationTokenKeyPrefix: "user:token:",
}

export type DB = {
  getItem: (key: string) => Awaitable<any>
  setItem: (key: string, value: string) => Awaitable<void>
  deleteItems: (...keys: string[]) => Awaitable<void>
}

export function TestAdapter(client: DB): Adapter {
  const { baseKeyPrefix } = options
  const accountKeyPrefix = baseKeyPrefix + options.accountKeyPrefix
  const accountByUserIdPrefix = baseKeyPrefix + options.accountByUserIdPrefix
  const emailKeyPrefix = baseKeyPrefix + options.emailKeyPrefix
  const sessionKeyPrefix = baseKeyPrefix + options.sessionKeyPrefix
  const sessionByUserIdKeyPrefix =
    baseKeyPrefix + options.sessionByUserIdKeyPrefix
  const userKeyPrefix = baseKeyPrefix + options.userKeyPrefix
  const verificationTokenKeyPrefix =
    baseKeyPrefix + options.verificationTokenKeyPrefix

  const setObjectAsJson = async (key: string, obj: any) =>
    await client.setItem(key, JSON.stringify(obj))

  const setAccount = async (id: string, account: AdapterAccount) => {
    const accountKey = accountKeyPrefix + id
    await setObjectAsJson(accountKey, account)
    await client.setItem(accountByUserIdPrefix + account.userId, accountKey)
    return account
  }

  const getAccount = async (id: string) => {
    const account = await client.getItem(accountKeyPrefix + id)
    if (!account) return null
    return account
  }

  const setSession = async (
    id: string,
    session: AdapterSession,
  ): Promise<AdapterSession> => {
    const sessionKey = sessionKeyPrefix + id
    await setObjectAsJson(sessionKey, session)
    await client.setItem(sessionByUserIdKeyPrefix + session.userId, sessionKey)
    return session
  }

  const getSession = async (id: string) => {
    const session = await client.getItem(sessionKeyPrefix + id)
    if (!session) return null
    return session
  }

  const setUser = async (
    id: string,
    user: AdapterUser,
  ): Promise<AdapterUser> => {
    await setObjectAsJson(userKeyPrefix + id, user)
    await client.setItem(`${emailKeyPrefix}${user.email as string}`, id)
    return user
  }

  const getUser = async (id: string) => {
    const user = await client.getItem(userKeyPrefix + id)
    if (!user) return null
    return user
  }

  return {
    async createUser(user) {
      const id = crypto.randomUUID()
      // TypeScript thinks the emailVerified field is missing
      // but all fields are copied directly from user, so it's there
      return await setUser(id, { ...user, id })
    },
    getUser,
    async getUserByEmail(email) {
      const userId = await client.getItem(emailKeyPrefix + email)
      if (!userId) {
        return null
      }
      return await getUser(userId)
    },
    async getUserByAccount(account) {
      const dbAccount = await getAccount(
        `${account.provider}:${account.providerAccountId}`,
      )
      if (!dbAccount) return null
      return await getUser(dbAccount.userId)
    },
    async updateUser(updates) {
      const userId = updates.id as string
      const user = await getUser(userId)
      return await setUser(userId, { ...(user as AdapterUser), ...updates })
    },
    async linkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      return await setAccount(id, { ...account, id })
    },
    createSession: (session) => setSession(session.sessionToken, session),
    async getSessionAndUser(sessionToken) {
      const session = await getSession(sessionToken)
      if (!session) return null
      const user = await getUser(session.userId)
      if (!user) return null
      return { session, user }
    },
    async updateSession(updates) {
      const session = await getSession(updates.sessionToken)
      if (!session) return null
      return await setSession(updates.sessionToken, { ...session, ...updates })
    },
    async deleteSession(sessionToken) {
      await client.deleteItems(sessionKeyPrefix + sessionToken)
    },
    async createVerificationToken(verificationToken) {
      await setObjectAsJson(
        verificationTokenKeyPrefix +
          verificationToken.identifier +
          ":" +
          verificationToken.token,
        verificationToken,
      )
      return verificationToken
    },
    async useVerificationToken(verificationToken) {
      const tokenKey =
        verificationTokenKeyPrefix +
        verificationToken.identifier +
        ":" +
        verificationToken.token

      const token = await client.getItem(tokenKey)
      if (!token) return null

      await client.deleteItems(tokenKey)
      return token
    },
    async unlinkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      const dbAccount = await getAccount(id)
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${id}`
      await client.deleteItems(
        accountKey,
        `${accountByUserIdPrefix} + ${dbAccount.userId as string}`,
      )
    },
    async deleteUser(userId) {
      const user = await getUser(userId)
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + userId
      const accountKey = await client.getItem(accountByUserKey)
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
      const sessionKey = await client.getItem(sessionByUserIdKey)
      await client.deleteItems(
        userKeyPrefix + userId,
        `${emailKeyPrefix}${user.email as string}`,
        accountKey as string,
        accountByUserKey,
        sessionKey as string,
        sessionByUserIdKey,
      )
    },
  }
}
