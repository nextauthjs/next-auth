/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://nats.io">NATS KeyValue</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://nats.io">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/nats.svg" width="60"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @nats-io/kv @nats-io/transport-node @auth/nats-kv-adapter
 * ```
 *
 * @module @auth/nats-kv-adapter
 */
import {
  type Adapter,
  type AdapterUser,
  type AdapterAccount,
  type AdapterSession,
  type VerificationToken,
  isDate,
} from "@auth/core/adapters"
import { KV } from "@nats-io/kv"

/**
 *
 * You can either use this with Symbol.asyncDispose or handle the disposal yourself.
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management
 * If you do choose asyncDispose, make sure you environment is configured to handled that
 * by targeting at least es2022 and the `lib` option to include `esnext` or `esnext.disposable`,
 * or by providing a polyfill. Using this pattern the adapter will call the cleanup function when the adapter is after NATS operations.
 *
 * You can instead provide the adapter with a KV instance, and handle the connection and disposal yourself.
 *
 * Usage:
 *   const kvm = new Kvm(client);
 *   const authKV = await kvm.create("authKV");
 *   export const { handlers, auth, signIn, signOut } = NextAuth({
 *   adapter: NatsKVAdapter(authKV),
 *   providers: [],
 * })
 */

/** This is the interface of the Nats KV adapter options. */
export interface NatsKVAdapterOptions {
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
  accountKeyPrefix: "user.account.",
  accountByUserIdPrefix: "user.account.by-user-id.",
  emailKeyPrefix: "user.email.",
  sessionKeyPrefix: "user.session.",
  sessionByUserIdKeyPrefix: "user.session.by-user-id.",
  userKeyPrefix: "user.",
  verificationTokenKeyPrefix: "user.token.",
}

export function hydrateDates(json: object) {
  return Object.entries(json).reduce((acc, [key, val]) => {
    acc[key] = isDate(val) ? new Date(val as string) : val
    return acc
  }, {} as any)
}

// replace symbols that are not allowed in keys
export function natsKey(identifier: string) {
  return identifier
    .replace(/@/g, "_at_")
    .replace(/:/g, "_colon_")
    .replace(/ /g, "_") as string
}

export function nats2json(value: any) {
  return JSON.parse(value.toString())
}

export function NatsKVAdapter(
  natsConnect:
    | (() => Promise<
        { kv: KV } & {
          [Symbol.asyncDispose]: () => Promise<void>
        }
      >)
    | KV,
  options: NatsKVAdapterOptions = {}
): Adapter {
  const [disposableConnection, kv] =
    typeof natsConnect === "function"
      ? [natsConnect, null]
      : [null, natsConnect]

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

  const natsPutJson = async (key: string, obj: any) => {
    return await natsPut(key, JSON.stringify(obj))
  }

  const natsPut = async (key: string, obj: any) => {
    if (disposableConnection) {
      await using nc = await disposableConnection()
      return await nc.kv.put(key, obj)
    } else {
      return await kv.put(key, obj)
    }
  }

  const natsPurge = async (key: string) => {
    if (disposableConnection) {
      await using nc = await disposableConnection()
      return await nc.kv.purge(key)
    } else {
      return await kv.purge(key)
    }
  }

  const natsGet = async (key: string) => {
    if (disposableConnection) {
      await using nc = await disposableConnection()
      return await nc.kv.get(key)
    } else {
      return await kv.get(key)
    }
  }

  const setAccount = async (id: string, account: AdapterAccount) => {
    const accountKey = accountKeyPrefix + natsKey(id)
    await natsPutJson(accountKey, account)
    await natsPut(accountByUserIdPrefix + natsKey(account.userId), accountKey)
    return account
  }

  const getAccount = async (id: string) => {
    const data = await natsGet(accountKeyPrefix + natsKey(id))
    if (!data || data.length == 0) return null
    const account = data.json<AdapterAccount>()
    return hydrateDates(account)
  }

  const setSession = async (
    id: string,
    session: AdapterSession
  ): Promise<AdapterSession> => {
    const sessionKey = sessionKeyPrefix + natsKey(id)
    await natsPutJson(sessionKey, session)
    await natsPut(
      sessionByUserIdKeyPrefix + natsKey(session.userId),
      sessionKey
    )
    return session
  }

  const getSession = async (id: string) => {
    const data = await natsGet(sessionKeyPrefix + natsKey(id))
    if (!data || data.length == 0) return null
    const session = data.json<AdapterSession>()
    return hydrateDates(session)
  }

  const setUser = async (
    id: string,
    user: AdapterUser
  ): Promise<AdapterUser> => {
    await natsPutJson(userKeyPrefix + natsKey(id), user)
    await natsPut(`${emailKeyPrefix}${natsKey(user.email)}`, id)
    return user
  }

  const getUser = async (id: string) => {
    const data = await natsGet(userKeyPrefix + natsKey(id))
    if (!data || data.length == 0) return null
    const user = data.json<AdapterUser>()

    return hydrateDates(user)
  }

  return {
    async createUser(user) {
      const id = crypto.randomUUID()
      return await setUser(id, { ...user, id })
    },
    getUser,
    async getUserByEmail(email) {
      const data = await natsGet(emailKeyPrefix + natsKey(email))

      if (!data || data.length == 0) return null
      const userId = data.string()
      return await getUser(userId)
    },
    async getUserByAccount(account) {
      const dbAccount = await getAccount(
        `${account.provider}.${account.providerAccountId}`
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
      const id = `${account.provider}.${account.providerAccountId}`
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
      await natsPurge(sessionKeyPrefix + sessionToken)
    },
    async createVerificationToken(verificationToken) {
      await natsPutJson(
        verificationTokenKeyPrefix +
          natsKey(verificationToken.identifier) +
          "." +
          natsKey(verificationToken.token),
        verificationToken
      )
      return verificationToken
    },
    async useVerificationToken(verificationToken) {
      const tokenKey =
        verificationTokenKeyPrefix +
        natsKey(verificationToken.identifier) +
        "." +
        natsKey(verificationToken.token)
      const data = await natsGet(tokenKey)
      if (!data || data.length == 0) return null
      const token = data.json<VerificationToken>()
      await natsPurge(tokenKey)
      return hydrateDates(token)
    },
    async unlinkAccount(account) {
      const id = `${account.provider}.${account.providerAccountId}`
      const dbAccount = await getAccount(natsKey(id))
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${natsKey(id)}`
      await natsPurge(accountKey)
      await natsPurge(`${(accountByUserIdPrefix + dbAccount.userId) as string}`)
    },
    async deleteUser(userId) {
      const user = await getUser(natsKey(userId))
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + natsKey(userId)
      const accountKey = await natsGet(accountByUserKey).then((data) =>
        data?.string()
      )
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + natsKey(userId)
      const sessionKey = await natsGet(sessionByUserIdKey).then((data) =>
        data?.string()
      )
      await Promise.all([
        natsPurge(userKeyPrefix + natsKey(userId)),
        natsPurge(`${emailKeyPrefix}${natsKey(user.email)}`),
        natsPurge(accountKey as string),
        natsPurge(accountByUserKey),
        natsPurge(sessionKey as string),
        natsPurge(sessionByUserIdKey),
      ])
    },
  }
}
