import type { Account as AdapterAccount } from "next-auth"
import type { Adapter, AdapterUser, AdapterSession } from "next-auth/adapters"
import type { Upstash } from "@upstash/redis/src/types"

import { v4 as uuid } from "uuid"

export interface UpstashRedisAdapterOptions {
  baseKeyPrefix?: string
  accountKeyPrefix?: string
  accountByUserIdPrefix?: string
  emailKeyPrefix?: string
  sessionKeyPrefix?: string
  sessionByUserIdKeyPrefix?: string
  userKeyPrefix?: string
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

const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

export function reviveFromJson(json: string) {
  return JSON.parse(json, (_, value) =>
    isDate(value) ? new Date(value) : value
  )
}

export function UpstashRedisAdapter(
  client: Upstash,
  options: UpstashRedisAdapterOptions = {}
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

  const getAccount = async (id: string) => {
    const response = await client.get(accountKeyPrefix + id)
    if (!response.data) return null
    return reviveFromJson(response.data)
  }

  const setSession = async (id: string, session: AdapterSession) => {
    const sessionKey = sessionKeyPrefix + id
    await setObjectAsJson(sessionKey, session)
    await client.set(sessionByUserIdKeyPrefix + session.userId, sessionKey)
    return session
  }

  const getSession = async (id: string) => {
    const response = await client.get(sessionKeyPrefix + id)
    if (!response.data) return null
    return reviveFromJson(response.data)
  }

  const setUser = async (id: string, user: AdapterUser) => {
    await setObjectAsJson(userKeyPrefix + id, user)
    await client.set(`${emailKeyPrefix}${user.email as string}`, id)
    return user
  }

  const getUser = async (id: string) => {
    const response = await client.get(userKeyPrefix + id)
    if (!response.data) return null
    return reviveFromJson(response.data)
  }

  return {
    async createUser(user) {
      const id = uuid()
      // TypeScript thinks the emailVerified field is missing
      // but all fields are copied directly from user, so it's there
      // @ts-expect-error
      return await setUser(id, { ...user, id })
    },
    getUser,
    async getUserByEmail(email) {
      const emailResponse = await client.get(emailKeyPrefix + email)
      if (!emailResponse.data) return null
      return await getUser(emailResponse.data)
    },
    async getUserByAccount(account) {
      const dbAccount = await getAccount(
        `${account.provider}:${account.providerAccountId}`
      )
      if (!dbAccount) return null
      return await getUser(dbAccount.userId)
    },
    async updateUser(updates) {
      const userId = updates.id as string
      const user = await getUser(userId)
      return await setUser(userId, { ...user, ...updates })
    },
    async linkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      return await setAccount(id, { ...account, id })
    },
    async createSession(session) {
      const id = session.sessionToken
      return await setSession(id, { ...session, id })
    },
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
      await setObjectAsJson(
        verificationTokenKeyPrefix + verificationToken.identifier,
        verificationToken
      )
      return verificationToken
    },
    async useVerificationToken(verificationToken) {
      const tokenKey = verificationTokenKeyPrefix + verificationToken.identifier
      const tokenResponse = await client.get(tokenKey)
      if (!tokenResponse.data) return null
      await client.del(tokenKey)
      return reviveFromJson(tokenResponse.data)
    },
    async unlinkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      const dbAccount = await getAccount(id)
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${id}`
      await client.del(
        accountKey,
        `${accountByUserIdPrefix} + ${dbAccount.userId as string}`
      )
    },
    async deleteUser(userId) {
      const user = await getUser(userId)
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + userId
      const accountRequest = await client.get(accountByUserKey)
      const accountKey = accountRequest.data
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
      const sessionRequest = await client.get(sessionByUserIdKey)
      const sessionKey = sessionRequest.data
      await client.del(
        userKeyPrefix + userId,
        `${emailKeyPrefix}${user.email as string}`,
        accountKey,
        accountByUserKey,
        sessionKey,
        sessionByUserIdKey
      )
    },
  }
}
