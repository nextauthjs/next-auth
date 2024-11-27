/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p><a href="https://github.com/redis/ioredis">Redis</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://github.com/redis/ioredis">
 *   <img style={{display: "block"}} src="https://avatars.githubusercontent.com/u/1529926?s=60" width="60"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install ioredis @auth/redis-adapter
 * ```
 *
 * @module @auth/redis-adapter
 */
import {
  isDate,
  type Adapter,
  type AdapterAccount,
  type AdapterSession,
  type AdapterUser,
} from "@auth/core/adapters"

import type { Redis } from "ioredis"

/** This is the interface of the Redis adapter options. */
export interface RedisAdapterOptions {
  /**
   * The base prefix for your keys
   */
  baseKeyPrefix?: string
  /**
   * The prefix for the `account` key
   */
  accountKeyPrefix?: string
  /**
   * The prefix for the `accountByUserId` key
   */
  accountByUserIdPrefix?: string
  /**
   * The prefix for the `emailKey` key
   */
  emailKeyPrefix?: string
  /**
   * The prefix for the `sessionKey` key
   */
  sessionKeyPrefix?: string
  /**
   * The prefix for the `sessionByUserId` key
   */
  sessionByUserIdKeyPrefix?: string
  /**
   * The prefix for the `user` key
   */
  userKeyPrefix?: string
  /**
   * The prefix for the `verificationToken` key
   */
  verificationTokenKeyPrefix?: string
}

export const defaultOptions = {
  baseKeyPrefix: "",
  accountKeyPrefix: "user:account:",
  accountByUserIdPrefix: "user:account:by-user-id:",
  emailKeyPrefix: "user:email:",
  sessionKeyPrefix: "user:session:",
  sessionByUserIdKeyPrefix: "user:session:by-user-id:",
  userKeyPrefix: "user:",
  verificationTokenKeyPrefix: "user:token:",
}

export function hydrateDates(json: object) {
  return Object.entries(json).reduce((acc, [key, val]) => {
    acc[key] = isDate(val) ? new Date(val as string) : val
    return acc
  }, {} as any)
}

export function RedisAdapter(
  client: Redis,
  options: RedisAdapterOptions = {}
): Adapter {
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  const { baseKeyPrefix } = mergedOptions
  const accountKeyPrefix = baseKeyPrefix + mergedOptions.accountKeyPrefix
  const accountByUserIdPrefix =
    baseKeyPrefix + mergedOptions.accountByUserIdPrefix
  const emailKeyPrefix = baseKeyPrefix + mergedOptions.emailKeyPrefix
  const sessionKeyPrefix = baseKeyPrefix + mergedOptions.sessionKeyPrefix
  const sessionByUserIdKeyPrefix =
    baseKeyPrefix + mergedOptions.sessionByUserIdKeyPrefix
  const userKeyPrefix = baseKeyPrefix + mergedOptions.userKeyPrefix
  const verificationTokenKeyPrefix =
    baseKeyPrefix + mergedOptions.verificationTokenKeyPrefix

  const setObjectAsJson = async (key: string, obj: any) =>
    await client.set(key, JSON.stringify(obj))

  const setAccount = async (id: string, account: AdapterAccount) => {
    const accountKey = accountKeyPrefix + id
    await setObjectAsJson(accountKey, account)
    await client.set(accountByUserIdPrefix + account.userId, accountKey)
    return account
  }

  const getAccount = async (id: string): Promise<AdapterAccount | null> => {
    const data = await client.get(accountKeyPrefix + id)
    if (!data) return null
    const account = JSON.parse(data)
    return hydrateDates(account) as AdapterAccount
  }

  const setSession = async (
    id: string,
    session: AdapterSession
  ): Promise<AdapterSession> => {
    const sessionKey = sessionKeyPrefix + id
    await setObjectAsJson(sessionKey, session)
    await client.set(sessionByUserIdKeyPrefix + session.userId, sessionKey)
    return session
  }

  const getSession = async (id: string): Promise<AdapterSession | null> => {
    const data = await client.get(sessionKeyPrefix + id)
    if (!data) return null
    const session = JSON.parse(data)
    return hydrateDates(session) as AdapterSession
  }

  const setUser = async (
    id: string,
    user: AdapterUser
  ): Promise<AdapterUser> => {
    await setObjectAsJson(userKeyPrefix + id, user)
    await client.set(`${emailKeyPrefix}${user.email as string}`, id)
    return user
  }

  const getUser = async (id: string): Promise<AdapterUser | null> => {
    const data = await client.get(userKeyPrefix + id)
    if (!data) return null
    const user = JSON.parse(data)
    return hydrateDates(user) as AdapterUser
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
      const userId = await client.get(emailKeyPrefix + email)
      if (!userId) return null
      return await getUser(userId)
    },
    async getUserByAccount(account) {
      const dbAccount = await getAccount(
        `${account.provider}:${account.providerAccountId}`
      )
      if (!dbAccount) return null
      return await getUser(dbAccount.userId)
    },
    async updateUser(updates) {
      const userId = updates.id
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
      await client.del(sessionKeyPrefix + sessionToken)
    },
    async createVerificationToken(verificationToken) {
      const key = `${verificationTokenKeyPrefix}${verificationToken.identifier}:${verificationToken.token}`
      await setObjectAsJson(key, verificationToken)
      return verificationToken
    },
    async useVerificationToken(verificationToken) {
      const key = `${verificationTokenKeyPrefix}${verificationToken.identifier}:${verificationToken.token}`
      const data = await client.get(key)
      if (!data) return null
      const token = JSON.parse(data)

      await client.del(key)
      return hydrateDates(token)
      // return reviveFromJson(token)
    },
    async unlinkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      const dbAccount = await getAccount(id)
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${id}`
      await client.del(accountKey, accountByUserIdPrefix + dbAccount.userId)
    },
    async deleteUser(userId) {
      const user = await getUser(userId)
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + userId
      const accountKey = (await client.get(accountByUserKey)) as string
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
      const sessionKey = (await client.get(sessionByUserIdKey)) as string
      await client.del(
        userKeyPrefix + userId,
        emailKeyPrefix + user.email,
        accountKey,
        accountByUserKey,
        sessionKey,
        sessionByUserIdKey
      )
    },
  }
}
