import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "next-auth/adapters"
import type { RedisClientType } from "redis"

import { v4 as uuid } from "uuid"

export interface RedisJSONAdapterOptions {
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

export function hydrateDates(json: object) {
  return Object.entries(json).reduce((acc, [key, val]) => {
    acc[key] = isDate(val) ? new Date(val as string) : val
    return acc
  }, {} as any)
}

export function RedisJSONAdapter(
  client: RedisClientType,
  options: RedisJSONAdapterOptions = {}
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

  const db = (async () => {
    if (!client.isReady) {
      await client.connect();
    }
    return client;
  })();

  const setObjectAsJson = async (key: string, obj: any) =>
    await (await db).json.set(key, '$', obj)

  const setAccount = async (id: string, account: AdapterAccount) => {
    const accountKey = accountKeyPrefix + id
    await setObjectAsJson(accountKey, account)
    await (await db).set(accountByUserIdPrefix + account.userId, accountKey)
    return hydrateDates(account);
  }

  const getAccount = async (id: string): Promise<AdapterAccount> => {
    const account = await (await db).json.get(accountKeyPrefix + id) as AdapterAccount;
    if (!account) return null
    return hydrateDates(account);
  }

  const setSession = async (
    id: string,
    session: AdapterSession
  ): Promise<AdapterSession> => {
    const sessionKey = sessionKeyPrefix + id
    await setObjectAsJson(sessionKey, session)
    await (await db).set(sessionByUserIdKeyPrefix + session.userId, sessionKey)
    return hydrateDates(session);
  }

  const getSession = async (id: string): Promise<AdapterSession> => {
    const session = await (await db).json.get(sessionKeyPrefix + id) as AdapterSession;
    if (!session) return null
    return hydrateDates(session);
  }

  const setUser = async (
    id: string,
    user: AdapterUser
  ): Promise<AdapterUser> => {
    await setObjectAsJson(userKeyPrefix + id, user)
    await (await db).set(`${emailKeyPrefix}${user.email as string}`, id)
    return hydrateDates(user);
  }

  const getUser = async (id: string): Promise<AdapterUser> => {
    const user = await (await db).json.get(userKeyPrefix + id) as AdapterUser;
    if (!user) return null
    return hydrateDates(user);
  }

  return {
    async createUser(user) {
      const id = uuid()
      // TypeScript thinks the emailVerified field is missing
      // but all fields are copied directly from user, so it's there
      return await setUser(id, { ...user, id })
    },
    getUser,
    async getUserByEmail(email) {
      const userId = await (await db).get(emailKeyPrefix + email) as string;
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
      await (await db).del(sessionKeyPrefix + sessionToken);
    },
    async createVerificationToken(verificationToken) {
      await setObjectAsJson(
        verificationTokenKeyPrefix +
          verificationToken.identifier +
          ":" +
          verificationToken.token,
        verificationToken
      )
      return verificationToken;
    },
    async useVerificationToken(verificationToken) {
      const tokenKey =
        verificationTokenKeyPrefix +
        verificationToken.identifier +
        ":" +
        verificationToken.token

      const token = await (await db).json.get(tokenKey) as VerificationToken;
      if (!token) return null
      await (await db).json.del(tokenKey)
      return hydrateDates(token);
    },
    async unlinkAccount(account) {
      const id = `${account.provider}:${account.providerAccountId}`
      const dbAccount = await getAccount(id)
      if (!dbAccount) return
      const accountKey = `${accountKeyPrefix}${id}`
      await (await db).del([
        accountKey,
        `${accountByUserIdPrefix} + ${dbAccount.userId as string}`
      ]);
    },
    async deleteUser(userId) {
      const user = await getUser(userId)
      if (!user) return
      const accountByUserKey = accountByUserIdPrefix + userId;
      const accountKey = await (await db).get(accountByUserKey);
      const sessionByUserIdKey = sessionByUserIdKeyPrefix + userId;
      const sessionKey = await (await db).get(sessionByUserIdKey);
      await (await db).del([
        userKeyPrefix + userId,
        `${emailKeyPrefix}${user.email as string}`,
        accountKey as string,
        accountByUserKey,
        sessionKey as string,
        sessionByUserIdKey
      ])
    },
  }
}
