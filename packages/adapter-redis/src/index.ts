/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  Official <a href="https://redis.io/">Redis</a> adapter for Auth.js / NextAuth.js.
 *  <a href="https://redis.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/redis.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install redis @auth/redis-adapter
 * ```
 *
 * @module @auth/redis-adapter
 */
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import type { RedisClientType } from "redis"
import { randomUUID } from "crypto"

// https://github.com/honeinc/is-iso-date/blob/8831e79b5b5ee615920dcb350a355ffc5cbf7aed/index.js#L5
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

const isDate = (val: any): val is ConstructorParameters<typeof Date>[0] =>
  !!(val && isoDateRE.test(val) && !isNaN(Date.parse(val)))

export const format = {
  /** Takes an object that's coming from a database and converts it to plain JavaScript. */
  from<T>(object: Record<string, any> = {}): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (isDate(value)) newObject[key] = new Date(value)
      else newObject[key] = value
    return newObject as T
  },
  /** Takes an object that's coming from Auth.js and prepares it to be written to the database. */
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (value instanceof Date) newObject[key] = value.toISOString()
      else newObject[key] = value
    return newObject as T
  },
}

export function RedisAdapter(redisClient: RedisClientType): Adapter {
  const client = {
    async getObject<T>(key: string) {
      const value = await redisClient.get(key)
      if (!value) return null
      return format.from(JSON.parse(value)) as T
    },
    async setObject(key: string, value: Record<string, any>) {
      await redisClient.set(key, JSON.stringify(format.to(value)))
    },
    async getString(key: string) {
      const value = await redisClient.get(key)
      if (!value) return null
      return value
    },
    async setString(key: string, value: string) {
      await redisClient.set(key, value)
    },
    async getStringArray(key: string) {
      const value = await redisClient.lRange(key, 0, -1)
      return value
    },
    async pushStringArray(key: string, value: string) {
      await redisClient.rPush(key, value)
    },
    async del(key: string) {
      await redisClient.del(key)
    },
    async expireAt(key: string, unixTimeSeconds: Date) {
      await redisClient.expireAt(key, unixTimeSeconds)
    },
  }

  type ProviderAccountId = {
    provider: string
    providerAccountId: string
  }
  type VerificationTokenParams = {
    identifier: string
    token: string
  }

  const getAccountId = (providerAccountId: ProviderAccountId) => {
    return `${providerAccountId.provider}:${providerAccountId.providerAccountId}`
  }
  const getVerificationTokenId = (params: VerificationTokenParams) => {
    return `${params.identifier}:${params.token}`
  }

  const getUserKey = (userId: string) => `user:${userId}`
  const getSessionKey = (sessionToken: string) => `session:${sessionToken}`
  const getAccountKey = (accountId: string) => `account:${accountId}`
  const getVerificationTokenKey = (verificationTokenId: string) =>
    `verification-token:${verificationTokenId}`

  const getUserIdByEmailKey = (email: string) => `user-id:by-email:${email}`

  const getSessionIdsByUserIdKey = (userId: string) =>
    `session-ids:by-user-id:${userId}`
  const getAccountIdsByUserIdKey = (userId: string) =>
    `account-ids:by-user-id:${userId}`

  const setUser = async (userId: string, user: AdapterUser) => {
    await client.setObject(getUserKey(userId), { ...user, id: userId })
    await client.setString(getUserIdByEmailKey(user.email), userId)
  }
  const getUser = async (userId: string) => {
    const user = await client.getObject<AdapterUser>(getUserKey(userId))
    return user
  }

  const getUserIdByEmail = async (email: string) => {
    const userId = await client.getString(getUserIdByEmailKey(email))
    return userId
  }

  const setSession = async (session: AdapterSession) => {
    await client.setObject(getSessionKey(session.sessionToken), session)
    await client.pushStringArray(
      getSessionIdsByUserIdKey(session.userId),
      session.sessionToken
    )
  }
  const getSession = async (sessionToken: string) => {
    const session = await client.getObject<AdapterSession>(
      getSessionKey(sessionToken)
    )
    return session
  }
  const deleteSession = async (sessionToken: string) => {
    await client.del(getSessionKey(sessionToken))
  }

  const setAccount = async (account: AdapterAccount) => {
    await client.setObject(getAccountKey(getAccountId(account)), account)
    await client.pushStringArray(
      getAccountIdsByUserIdKey(account.userId),
      getAccountId(account)
    )
  }
  const getAccount = async (providerAccountId: ProviderAccountId) => {
    const account = await client.getObject<AdapterAccount>(
      getAccountKey(getAccountId(providerAccountId))
    )
    return account
  }
  const deleteAccount = async (providerAccountId: ProviderAccountId) => {
    await client.del(getAccountKey(getAccountId(providerAccountId)))
  }

  const setVerificationToken = async (verificationToken: VerificationToken) => {
    await client.setObject(
      getVerificationTokenKey(getVerificationTokenId(verificationToken)),
      verificationToken
    )
    await client.expireAt(
      getVerificationTokenKey(getVerificationTokenId(verificationToken)),
      verificationToken.expires
    )
  }
  const getVerificationToken = async (params: VerificationTokenParams) => {
    const verificationToken = await client.getObject<VerificationToken>(
      getVerificationTokenKey(getVerificationTokenId(params))
    )
    return verificationToken
  }
  const deleteVerificationToken = async (params: VerificationTokenParams) => {
    await client.del(getVerificationTokenKey(getVerificationTokenId(params)))
  }

  const deleteAllSessionByUserId = async (userId: string) => {
    const sessionIds = await client.getStringArray(
      getSessionIdsByUserIdKey(userId)
    )
    for (const sessionId of sessionIds) {
      await client.del(getSessionKey(sessionId))
    }
    await client.del(getSessionIdsByUserIdKey(userId))
  }
  const deleteAllAccountByUserId = async (userId: string) => {
    const accountIds = await client.getStringArray(
      getAccountIdsByUserIdKey(userId)
    )
    for (const accountId of accountIds) {
      await client.del(getAccountKey(accountId))
    }
    await client.del(getAccountIdsByUserIdKey(userId))
  }
  const deleteUser = async (userId: string) => {
    await deleteAllSessionByUserId(userId)
    await deleteAllAccountByUserId(userId)
    const user = await client.getObject<AdapterUser>(getUserKey(userId))
    if (!user) return
    await client.del(getUserKey(userId))
    await client.del(getUserIdByEmailKey(user.email))
  }

  return {
    createSession: async (session) => {
      await setSession(session)
      return session
    },
    createUser: async (user) => {
      const userId = randomUUID()
      await setUser(userId, user)
      return { ...user, id: userId }
    },
    createVerificationToken: async (verificationToken) => {
      await setVerificationToken(verificationToken)
      return verificationToken
    },
    deleteSession,
    deleteUser,
    getSessionAndUser: async (sessionToken) => {
      const session = await getSession(sessionToken)
      if (!session) return null
      const user = await getUser(session.userId)
      if (!user) return null
      return { session, user }
    },
    getUser,
    getUserByAccount: async (providerAccountId) => {
      const account = await getAccount(providerAccountId)
      if (!account) return null
      const user = await getUser(account.userId)
      if (!user) return null
      return user
    },
    getUserByEmail: async (email) => {
      const userId = await getUserIdByEmail(email)
      if (!userId) return null
      const user = await getUser(userId)
      if (!user) return null
      return user
    },
    linkAccount: async (account) => {
      await setAccount(account)
      return account
    },
    unlinkAccount: async (providerAccountId) => {
      await deleteAccount(providerAccountId)
    },
    updateSession: async (session) => {
      const currentSession = await getSession(session.sessionToken)
      if (!currentSession)
        throw new Error("[RedisAdapter] updateSession: Session does not exist.")
      const newSession = { ...currentSession, ...session }
      await setSession(newSession)
      return newSession
    },
    updateUser: async (user) => {
      const currentUser = await getUser(user.id)
      if (!currentUser)
        throw new Error("[RedisAdapter] updateUser: User does not exist.")
      const newUser = { ...currentUser, ...user }
      await setUser(user.id, newUser)
      return newUser
    },
    useVerificationToken: async (params) => {
      const verificationToken = await getVerificationToken(params)
      if (!verificationToken) return null
      await deleteVerificationToken(params)
      return verificationToken
    },
  }
}
