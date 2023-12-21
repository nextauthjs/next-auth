/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://redis.io/">Redis</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://redis.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/redis.svg" width="60"/>
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

/**
 * ## Setup
 *
 * Configure Auth.js to use the Redis Adapter:
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { RedisAdapter } from "@auth/redis-adapter"
 * import { createClient } from "redis"
 *
 * const client = createClient()
 *   .on('error', err => console.log('Redis Client Error', err))
 *   .connect();
 *
 * export default NextAuth({
 *   adapter: RedisAdapter(client),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ## Advanced usage
 *
 * ### Using multiple apps with a single Redis instance
 *
 * If you have multiple Auth.js connected apps using only one instance, you need different key prefixes for every app.
 *
 * You can change the prefixes by passing an `options` object as the second argument to the adapter factory function.
 *
 * The default values for this object are:
 *
 * ```js
 * const defaultOptions = {
 *   baseKeyPrefix: "",
 *   accountKeyPrefix: "user:account:",
 *   accountByUserIdPrefix: "user:account:by-user-id:",
 *   emailKeyPrefix: "user:email:",
 *   sessionKeyPrefix: "user:session:",
 *   sessionByUserIdKeyPrefix: "user:session:by-user-id:",
 *   userKeyPrefix: "user:",
 *   verificationTokenKeyPrefix: "user:token:",
 * }
 * ```
 *
 * Usually changing the `baseKeyPrefix` should be enough for this scenario, but for more custom setups, you can also change the prefixes of every single key.
 *
 * Example:
 *
 * ```js
 * export default NextAuth({
 *   ...
 *   adapter: RedisAdapter(redis, {baseKeyPrefix: "app2:"})
 *   ...
 * })
 * ```
 */
export function RedisAdapter(
  client: RedisClientType,
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

  const setAccount = async (id: string, account: AdapterAccount) => {
    const accountKey = accountKeyPrefix + id
    // @ts-ignore
    await client.json.set(accountKey, "$", account)
    await client.set(accountByUserIdPrefix + account.userId, accountKey)
    return account
  }

  const getAccount = async (id: string) => {
    const account = await client.json.get(accountKeyPrefix + id)
    if (!account) return null
    return format.from<AdapterAccount>(account as Record<string, any>)
  }

  const setSession = async (
    id: string,
    session: AdapterSession
  ): Promise<AdapterSession> => {
    const sessionKey = sessionKeyPrefix + id
    // @ts-ignore
    await client.json.set(sessionKey, "$", session)
    await client.set(sessionByUserIdKeyPrefix + session.userId, sessionKey)
    return session
  }

  const getSession = async (id: string) => {
    const session = await client.json.get(sessionKeyPrefix + id)
    if (!session) return null
    return format.from<AdapterSession>(session as Record<string, any>)
  }

  const setUser = async (
    id: string,
    user: AdapterUser
  ): Promise<AdapterUser> => {
    // @ts-ignore
    await client.json.set(userKeyPrefix + id, "$", user)
    await client.set(`${emailKeyPrefix}${user.email as string}`, id)
    return user
  }

  const getUser = async (id: string) => {
    const user = await client.json.get(userKeyPrefix + id)
    if (!user) return null
    return format.from<AdapterUser>(user as Record<string, any>)
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
      if (!userId) {
        return null
      }
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
      await client.del(sessionKeyPrefix + sessionToken)
    },
    async createVerificationToken(verificationToken) {
      const key =
        verificationTokenKeyPrefix +
        verificationToken.identifier +
        ":" +
        verificationToken.token
      // @ts-ignore
      await client.json.set(key, "$", verificationToken)
      return verificationToken
    },
    async useVerificationToken(verificationToken) {
      const tokenKey =
        verificationTokenKeyPrefix +
        verificationToken.identifier +
        ":" +
        verificationToken.token

      const token = await client.json.get(tokenKey)
      if (!token) return null

      await client.del(tokenKey)
      return format.from<VerificationToken>(token as Record<string, any>)
    },
    async unlinkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      const dbAccount = await getAccount(id)
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${id}`
      await client.del(accountKey)
      await client.del(
        `${accountByUserIdPrefix} + ${dbAccount.userId as string}`
      )
    },
    async deleteUser(userId) {
      const user = await getUser(userId)
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + userId
      const accountKey = await client.get(accountByUserKey)
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
      const sessionKey = await client.get(sessionByUserIdKey)
      await client.del(userKeyPrefix + userId)
      await client.del(`${emailKeyPrefix}${user.email as string}`)
      await client.del(accountKey as string)
      await client.del(accountByUserKey)
      await client.del(sessionKey as string)
      await client.del(sessionByUserIdKey)
    },
  }
}
