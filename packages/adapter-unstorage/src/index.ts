/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p>Official <a href="https://unstorage.unjs.io/">Unstorage</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://unstorage.unjs.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/unstorage.svg" width="60"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install unstorage @auth/unstorage-adapter
 * ```
 *
 * @module @auth/unstorage-adapter
 */
import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  AdapterAuthenticator,
  VerificationToken,
} from "@auth/core/adapters"
import { isDate } from "@auth/core/adapters"
import type { Storage, StorageValue } from "unstorage"

/** This is the interface of the Unstorage adapter options. */
export interface UnstorageAdapterOptions {
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
  /**
   * The prefix for the `authenticator` key
   */
  authenticatorKeyPrefix?: string
  /**
   * The prefix for the `authenticator-by-user-id` key
   */
  authenticatorUserKeyPrefix?: string
  /**
   * Use `getItemRaw/setItemRaw` instead of `getItem/setItem`.
   *
   * This is an experimental feature. Please check [unjs/unstorage#142](https://github.com/unjs/unstorage/issues/142) for more information.
   */
  useItemRaw?: boolean
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
  authenticatorKeyPrefix: "authenticator:id:",
  authenticatorUserKeyPrefix: "authenticator:by-user-id:",
  useItemRaw: false,
}

export function hydrateDates(json: object) {
  return Object.entries(json).reduce((acc, [key, val]) => {
    acc[key] = isDate(val) ? new Date(val as string) : val
    return acc
  }, {} as any)
}

export function UnstorageAdapter(
  storage: Storage,
  options: UnstorageAdapterOptions = {}
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
  const authenticatorKeyPrefix =
    baseKeyPrefix + mergedOptions.authenticatorKeyPrefix
  const authenticatorUserKeyPrefix =
    baseKeyPrefix + mergedOptions.authenticatorUserKeyPrefix

  async function getItem<T extends StorageValue>(key: string) {
    if (mergedOptions.useItemRaw) {
      return await storage.getItemRaw<T>(key)
    } else {
      return await storage.getItem<T>(key)
    }
  }

  async function getItems(key: string[]) {
    if (mergedOptions.useItemRaw) {
      // Unstorage missing method to get multiple items raw, i.e. `getItemsRaw`
      return JSON.stringify(await storage.getItems(key))
    } else {
      return await storage.getItems(key)
    }
  }

  async function setItem(key: string, value: string) {
    if (mergedOptions.useItemRaw) {
      return await storage.setItemRaw(key, value)
    } else {
      return await storage.setItem(key, value)
    }
  }

  const setObjectAsJson = async (key: string, obj: any) => {
    if (mergedOptions.useItemRaw) {
      await storage.setItemRaw(key, obj)
    } else {
      await storage.setItem(key, JSON.stringify(obj))
    }
  }

  const setAccount = async (id: string, account: AdapterAccount) => {
    const accountKey = accountKeyPrefix + id
    await Promise.all([
      setObjectAsJson(accountKey, account),
      setItem(accountByUserIdPrefix + account.userId, accountKey),
    ])
    return account
  }

  const getAccount = async (id: string) => {
    const account = await getItem<AdapterAccount>(accountKeyPrefix + id)
    if (!account) return null
    return hydrateDates(account)
  }

  const setSession = async (
    id: string,
    session: AdapterSession
  ): Promise<AdapterSession> => {
    const sessionKey = sessionKeyPrefix + id
    await Promise.all([
      setObjectAsJson(sessionKey, session),
      setItem(sessionByUserIdKeyPrefix + session.userId, sessionKey),
    ])
    return session
  }

  const getSession = async (id: string) => {
    const session = await getItem<AdapterSession>(sessionKeyPrefix + id)
    if (!session) return null
    return hydrateDates(session)
  }

  const setUser = async (
    id: string,
    user: AdapterUser
  ): Promise<AdapterUser> => {
    await Promise.all([
      setObjectAsJson(userKeyPrefix + id, user),
      setItem(`${emailKeyPrefix}${user.email as string}`, id),
    ])
    return user
  }

  const getUser = async (id: string) => {
    const user = await getItem<AdapterUser>(userKeyPrefix + id)
    if (!user) return null
    return hydrateDates(user)
  }

  const setAuthenticator = async (
    credentialId: string,
    authenticator: AdapterAuthenticator
  ): Promise<AdapterAuthenticator> => {
    await Promise.all([
      setObjectAsJson(authenticatorKeyPrefix + credentialId, authenticator),
      setItem(
        `${authenticatorUserKeyPrefix}${authenticator.userId}`,
        credentialId
      ),
    ])
    return authenticator
  }

  const getAuthenticator = async (credentialId: string) => {
    const authenticator = await getItem<AdapterAuthenticator>(
      authenticatorKeyPrefix + credentialId
    )
    if (!authenticator) return null
    return hydrateDates(authenticator)
  }

  // TODO: This one doesn't really work with KV storage, as we can't set the same
  // key multiple times, they'll just overwrite one another. Maybe with some
  // additional logic to write an array as the value instead of overwriting
  // the pre-existing value. Probably in `setItems` implementation.
  const getAuthenticatorByUserId = async (
    userId: string
  ): Promise<AdapterAuthenticator[] | []> => {
    const credentialIds = await getItems([
      `${authenticatorUserKeyPrefix}${userId}`,
    ])
    if (!credentialIds.length) return []

    const authenticators = []
    for (const credentialId of credentialIds) {
      const credentialValue =
        typeof credentialId === "string" ? credentialId : credentialId.value

      const authenticator = await getAuthenticator(credentialValue as string)

      if (authenticator) {
        hydrateDates(authenticator)
        authenticators.push(authenticator)
      }
    }

    return authenticators
  }

  return {
    async getAccount(providerAccountId: string, provider: string) {
      const accountId = `${provider}:${providerAccountId}`
      const account = await getAccount(accountId)
      if (!account) return null
      return account
    },
    async createUser(user) {
      const id = crypto.randomUUID()
      return await setUser(id, { ...user, id })
    },
    getUser,
    async getUserByEmail(email) {
      const userId = await getItem<string>(emailKeyPrefix + email)
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
      await storage.removeItem(sessionKeyPrefix + sessionToken)
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

      const token = await getItem<VerificationToken>(tokenKey)
      if (!token) return null

      await storage.removeItem(tokenKey)
      return hydrateDates(token)
    },
    async unlinkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      const dbAccount = await getAccount(id)
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${id}`
      await Promise.all([
        storage.removeItem(accountKey),
        storage.removeItem(
          `${accountByUserIdPrefix} + ${dbAccount.userId as string}`
        ),
      ])
    },
    async deleteUser(userId) {
      const user = await getUser(userId)
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + userId
      const accountKey = await getItem<string>(accountByUserKey)
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId
      const sessionKey = await getItem<string>(sessionByUserIdKey)
      await Promise.all([
        storage.removeItem(userKeyPrefix + userId),
        storage.removeItem(`${emailKeyPrefix}${user.email as string}`),
        storage.removeItem(accountKey as string),
        storage.removeItem(accountByUserKey),
        storage.removeItem(sessionKey as string),
        storage.removeItem(sessionByUserIdKey),
      ])
    },
    async createAuthenticator(authenticator) {
      setAuthenticator(authenticator.credentialID, authenticator)
      return fromDBAuthenticator(authenticator)!
    },
    async getAuthenticator(credentialID) {
      const authenticator = await getAuthenticator(credentialID)
      return fromDBAuthenticator(authenticator)
    },
    async listAuthenticatorsByUserId(userId) {
      const user = await getUser(userId)
      if (!user) return []
      const authenticators = await getAuthenticatorByUserId(user.id)
      return authenticators
    },
    async updateAuthenticatorCounter(credentialID, counter) {
      const authenticator = await getAuthenticator(credentialID)
      authenticator.counter = Number(counter)
      setAuthenticator(credentialID, authenticator)
      return fromDBAuthenticator(authenticator)!
    },
  }
}

function fromDBAuthenticator(
  authenticator: AdapterAuthenticator & { id?: string; user?: string }
): AdapterAuthenticator | null {
  if (!authenticator) return null
  const { transports, id, user, ...other } = authenticator

  return {
    ...other,
    transports: transports || undefined,
  }
}
