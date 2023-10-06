/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Unofficial <a href="https://www.cloudflare.com/en-au/developer-platform/workers-kv/">Cloudflare KV</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://developers.cloudflare.com/workers/runtime-apis/kv/">
 *      <img style={{display: "block"}} src="/img/adapters/workerskv.svg" width="48" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install .........
 * ```
 *
 * @module @auth/workerskv-adapter
 */
import type { KVNamespace as WorkerKVNamespace } from "@cloudflare/workers-types"
import type { KVNamespace as MiniflareKVNamespace } from "@cloudflare/workers-types/experimental"

import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"

/**
 * @type @cloudflare/workers-types.KVNamespace | @miniflare/kv.KVNamespace
 */
export type KVNamespace = WorkerKVNamespace | MiniflareKVNamespace

/** This is the interface of the Cloudflare KV adapter options. */
export interface CloudflareKVAdapterOptions {
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

const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

export function hydrateDates(json: object) {
  return Object.entries(json).reduce((acc, [key, val]) => {
    acc[key] = isDate(val) ? new Date(val as string) : val
    return acc
  }, {} as any)
}

/**
 * TODO: Revise
 *
 * ## Setup
 *
 * Configure Auth.js to use the Cloudflare KV Adapter:
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * import { CloudflareKVAdapter } from "lib/cloudflare-kv-adapter"
 *
 * // Assign KV Binding in wrangler.toml or Cloudflare Dashboard
 *
 * export default NextAuth({
 *   adapter: CloudflareKVAdapter(process.env.KV_BINDING),
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
 * ### Using multiple apps with a single Cloudflare KV binding
 *
 * If you have multiple Auth.js connected apps using the same Cloudflare KV binding, you need different key prefixes for every app.
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
 * Changing the `baseKeyPrefix` should be enough for this scenario, but for more custom setups, you can also change the prefixes of every single key.
 *
 * Example:
 *
 * ```js
 * export default NextAuth({
 *   ...
 *   adapter: CloudflareKVAdapter(process.env.KV_BINDING, {baseKeyPrefix: "app2:"})
 *   ...
 * })
 * ```
 */
export function CloudflareKVAdapter(
  client: KVNamespace,
  options: CloudflareKVAdapterOptions = {}
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
    await client.put(key, JSON.stringify(obj))

  const getObject = async (key: string) =>
    await client.get(key, { type: "json" })

  const setAccount = async (id: string, account: AdapterAccount) => {
    const accountKey = accountKeyPrefix + id
    await setObjectAsJson(accountKey, account)
    await setObjectAsJson(accountByUserIdPrefix + account.userId, accountKey)
    return account
  }

  const getAccount = async (id: string) => {
    const account = await client.get<AdapterAccount>(accountKeyPrefix + id, {
      type: "json",
    })
    if (!account) return null
    return hydrateDates(account)
  }

  const setSession = async (
    id: string,
    session: AdapterSession
  ): Promise<AdapterSession> => {
    const sessionKey = sessionKeyPrefix + id
    await setObjectAsJson(sessionKey, session)
    await setObjectAsJson(sessionByUserIdKeyPrefix + session.userId, sessionKey)
    return session
  }

  const getSession = async (id: string) => {
    const session = await client.get<AdapterSession>(sessionKeyPrefix + id, {
      type: "json",
    })
    if (!session) return null
    return hydrateDates(session)
  }

  const setUser = async (
    id: string,
    user: AdapterUser
  ): Promise<AdapterUser> => {
    await setObjectAsJson(userKeyPrefix + id, user)
    await setObjectAsJson(`${emailKeyPrefix}${user.email as string}`, id)
    return user
  }

  const getUser = async (id: string) => {
    const user = await client.get<AdapterUser>(userKeyPrefix + id, {
      type: "json",
    })
    if (!user) return null
    return hydrateDates(user)
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
      const userId = await client.get<string>(emailKeyPrefix + email, {
        type: "json",
      })
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
      await client.delete(sessionKeyPrefix + sessionToken)
    },
    async createVerificationToken(verificationToken) {
      await setObjectAsJson(
        verificationTokenKeyPrefix +
        verificationToken.identifier +
        ":" +
        verificationToken.token,
        verificationToken
      )
      return verificationToken
    },
    async useVerificationToken(verificationToken) {
      const tokenKey =
        verificationTokenKeyPrefix +
        verificationToken.identifier +
        ":" +
        verificationToken.token

      const token = await client.get<VerificationToken>(tokenKey, {
        type: "json",
      })
      if (!token) return null

      await client.delete(tokenKey)
      return hydrateDates(token)
      // return reviveFromJson(token)
    },
    async unlinkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      const dbAccount = await getAccount(id)
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${id}`
      await client.delete(accountKey)
      await client.delete(
        `${accountByUserIdPrefix} + ${dbAccount.userId as string}`
      )
    },
    async deleteUser(userId) {
      const user = await getUser(userId)
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + userId
      const accountKey = await client.get<string>(accountByUserKey, {
        type: "json",
      })
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
      const sessionKey = await client.get<string>(sessionByUserIdKey, {
        type: "json",
      })
      await client.delete(userKeyPrefix + userId)
      await client.delete(`${emailKeyPrefix}${user.email as string}`)
      await client.delete(accountKey as string)
      await client.delete(accountByUserKey)
      await client.delete(sessionKey as string)
      await client.delete(sessionByUserIdKey)
    },
  }
}
