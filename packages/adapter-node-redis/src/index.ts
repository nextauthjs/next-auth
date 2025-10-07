/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://redis.io/docs/latest/develop/clients/nodejs">Node Redis</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://redis.io/docs/latest/develop/clients/nodejs">
 *   <img style={{display: "block"}} src="https://avatars.githubusercontent.com/u/1529926" width="60"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install redis @auth/node-redis-adapter
 * ```
 *
 * @module @auth/node-redis-adapter
 */
import { Account } from "@auth/core"

import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"

import { RedisClientType } from "redis"

import { v4 as uuid } from "uuid"

import { withRedisClient } from "./utils"

export interface RedisAdapterOptions {
  baseKeyPrefix?: string
  accountKeyPrefix?: string
  accountByUserIdPrefix?: string
  emailKeyPrefix?: string
  sessionKeyPrefix?: string
  sessionByUserIdKeyPrefix?: string
  userKeyPrefix?: string
  verificationTokenKeyPrefix?: string
}

export const defaultOptions: RedisAdapterOptions = {
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

export const hydrateDates = (json: object) => {
  return Object.entries(json).reduce((acc, [key, val]) => {
    acc[key] = isDate(val) ? new Date(val as string) : val
    return acc
  }, {} as any)
}

export function NodeRedisAdapter(options: RedisAdapterOptions = {}): Adapter {
  const mergedOptions = Object.entries({
    ...defaultOptions,
    ...options,
  }).reduce(
    (acc, [key, val]) => {
      if (key !== "baseKeyPrefix") {
        acc[key as keyof RedisAdapterOptions] = acc["baseKeyPrefix"] + val
      }
      return acc
    },
    {
      baseKeyPrefix: options.baseKeyPrefix || defaultOptions.baseKeyPrefix,
    } as RedisAdapterOptions
  )

  const {
    accountKeyPrefix,
    accountByUserIdPrefix,
    emailKeyPrefix,
    sessionKeyPrefix,
    sessionByUserIdKeyPrefix,
    userKeyPrefix,
    verificationTokenKeyPrefix,
  } = mergedOptions

  const getObjectFromRedis = <T extends object>(
    client: RedisClientType,
    key: string
  ) => {
    return client.get(key).then((value) => {
      if (!value) return null
      try {
        const t = JSON.parse(value) as T
        return hydrateDates(t) as T
      } catch (error: unknown) {
        console.error("RedisAdapter.getObjectFromRedis", error)
        return null
      }
    })
  }

  const saveObject = async <T>(
    client: RedisClientType,
    key: string,
    obj: T
  ) => {
    await client.set(key, JSON.stringify(obj))
    return obj
  }

  const getObject = async <T extends object>(
    client: RedisClientType,
    key: string
  ) => {
    return getObjectFromRedis<T>(client, key)
  }

  const getUser = (client: RedisClientType, id: string) => {
    return getObject<AdapterUser>(client, userKeyPrefix + id)
  }

  const setUser = async (
    client: RedisClientType,
    user: Omit<AdapterUser, "id">
  ) => {
    const id = uuid()
    if (user["email"]) {
      await client.set(`${emailKeyPrefix}${user["email"]}`, id)
    }
    const savedUser = {
      ...user,
      id,
    } as AdapterUser
    await saveObject(client, userKeyPrefix + id, savedUser)
    return savedUser
  }

  const deleteUser = async (client: RedisClientType, user: AdapterUser) => {
    if (user["email"]) {
      await client.del(`${emailKeyPrefix}${user["email"]}`)
    }
    await client.del(`${userKeyPrefix}${user.id}`)
    const sessionByUserIdKey = `${sessionByUserIdKeyPrefix}${user.id}`
    const sessionKey = await client.get(sessionByUserIdKey)
    await client.del(sessionByUserIdKey)
    if (sessionKey) {
      await client.del(sessionKey)
    }
    const accountByUserIdKey = accountByUserIdPrefix + user.id
    const accountKey = await client.get(accountByUserIdKey)
    await client.del(accountByUserIdKey)
    if (accountKey) {
      await client.del(accountKey)
    }
    return user
  }

  const updateUser = (client: RedisClientType, user: AdapterUser) => {
    return getObject<AdapterUser>(client, userKeyPrefix + user.id).then(
      async (olduser) => {
        // delete olduser email to prevent email duplication
        if (olduser && user["email"] !== olduser["email"]) {
          await client.del(`${emailKeyPrefix}${olduser["email"]}`)
          await client.set(`${emailKeyPrefix}${user["email"]}`, user.id)
        }
        await saveObject(client, userKeyPrefix + user.id, {
          ...olduser,
          ...user,
        } as AdapterUser)
        return user
      }
    )
  }

  return {
    createUser: async (user: Omit<AdapterUser, "id">) => {
      return withRedisClient(async (client: RedisClientType) => {
        return setUser(client, user)
      })
    },
    getUser: async (id: string) => {
      return withRedisClient(async (client: RedisClientType) => {
        return getUser(client, id)
      })
    },
    getUserByEmail: async (email: string) => {
      return withRedisClient(async (client: RedisClientType) => {
        const id = await client.get(emailKeyPrefix + email)
        if (!id) return null
        return getObject<AdapterUser>(client, userKeyPrefix + id)
      })
    },
    updateUser: async (user: Partial<AdapterUser>) => {
      return withRedisClient(async (client: RedisClientType) => {
        if (!user.id) {
          return setUser(client, {
            ...user,
            email: user.email || "",
            emailVerified: user.emailVerified || null,
          })
        }
        return updateUser(client, user as AdapterUser)
      })
    },
    deleteUser: (userId: string) => {
      return withRedisClient(async (client: RedisClientType) => {
        return getObject<AdapterUser>(client, userKeyPrefix + userId)
          .then((user) => {
            if (user) {
              return deleteUser(client, user)
            }
            return Promise.resolve(null)
          })
          .catch(() => Promise.resolve(null))
      })
    },
    /** Using the provider id and the id of the user for a specific account, get the user. */
    getUserByAccount: (
      providerAccountId: Pick<Account, "provider" | "providerAccountId">
    ) => {
      const id = `${accountKeyPrefix}${providerAccountId.provider}:${providerAccountId.providerAccountId}`
      return withRedisClient(async (client: RedisClientType) => {
        return getObject<Account>(client, id).then((account) => {
          if (account) {
            return getObject<AdapterUser>(
              client,
              `${userKeyPrefix}${account.userId}`
            )
          }
          return Promise.resolve(null)
        })
      })
    },
    linkAccount: (account: Account) => {
      const id = `${accountKeyPrefix}${account.provider}:${account.providerAccountId}`
      return withRedisClient(async (client: RedisClientType) => {
        return saveObject<Account>(client, id, account)
          .then((account) => {
            client
              .set(accountByUserIdPrefix + account.userId, id)
              .catch(console.error)
            return account
          })
          .catch(() => Promise.resolve(undefined))
      })
    },
    unlinkAccount: (
      providerAccountId: Pick<Account, "provider" | "providerAccountId">
    ) => {
      const id = `${accountKeyPrefix}${providerAccountId.provider}:${providerAccountId.providerAccountId}`
      return withRedisClient(async (client: RedisClientType) => {
        return getObject<Account>(client, id)
          .then((account) => {
            if (account) {
              client
                .del(accountByUserIdPrefix + account.userId)
                .catch(console.error)
              return client.del(id).then(() => account)
            }
            return Promise.resolve(undefined)
          })
          .catch(() => Promise.resolve(undefined))
      })
    },
    /** Creates a session for the user and returns it. */
    createSession: (session: {
      sessionToken: string
      userId: string
      expires: Date
    }) => {
      const key = `${sessionKeyPrefix}${session.sessionToken}`
      return withRedisClient(async (client: RedisClientType) => {
        return saveObject(client, key, session).then(() => {
          client
            .expireAt(key, Math.floor(session.expires.getTime() / 1000))
            .catch(console.error)
          client
            .set(`${sessionByUserIdKeyPrefix}${session.userId}`, key)
            .catch(console.error)
          return session as AdapterSession
        })
      })
    },
    getSessionAndUser: (sessionToken: string) => {
      return withRedisClient(async (client: RedisClientType) => {
        return getObject<AdapterSession>(
          client,
          `${sessionKeyPrefix}${sessionToken}`
        )
          .then((session) => {
            if (session) {
              return getObject<AdapterUser>(
                client,
                userKeyPrefix + session.userId
              ).then((user) => {
                if (user) {
                  return {
                    session,
                    user,
                  }
                }
                return {
                  session,
                  user: {} as AdapterUser,
                }
              })
            }
            return Promise.resolve(null)
          })
          .catch(() => Promise.resolve(null))
      })
    },
    updateSession: (
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) => {
      return withRedisClient(async (client: RedisClientType) => {
        return getObject<AdapterSession>(
          client,
          `${sessionKeyPrefix}${session.sessionToken}`
        )
          .then((oldsession) =>
            saveObject(client, `${sessionKeyPrefix}${session?.sessionToken}`, {
              ...oldsession,
              ...session,
            } as AdapterSession)
          )
          .catch(() => Promise.resolve(session as AdapterSession))
      })
    },
    /**
     * Deletes a session from the database.
     * It is preferred that this method also returns the session
     * that is being deleted for logging purposes.
     */
    deleteSession: (sessionToken: string) => {
      return withRedisClient(async (client: RedisClientType) => {
        return getObject<AdapterSession>(
          client,
          `${sessionKeyPrefix}${sessionToken}`
        )
          .then((session) => {
            if (session) {
              client
                .del(`${sessionByUserIdKeyPrefix}${session.userId}`)
                .catch(console.error)
              return client
                .del(`${sessionKeyPrefix}${sessionToken}`)
                .then(() => session)
            }
            return Promise.resolve(null)
          })
          .catch(() => Promise.resolve(null))
      })
    },
    createVerificationToken: (verificationToken: VerificationToken) => {
      return withRedisClient(async (client: RedisClientType) => {
        return saveObject(
          client,
          `${verificationTokenKeyPrefix}${verificationToken.identifier}:${verificationToken.token}`,
          verificationToken
        )
      })
    },
    /**
     * Return verification token from the database
     * and delete it so it cannot be used again.
     */
    useVerificationToken: ({
      identifier,
      token,
    }: {
      identifier: string
      token: string
    }) => {
      return withRedisClient(async (client: RedisClientType) => {
        return getObject<VerificationToken>(
          client,
          `${verificationTokenKeyPrefix}${identifier}:${token}`
        ).then((verificationToken) =>
          client
            .del(`${verificationTokenKeyPrefix}${identifier}:${token}`)
            .then(() => verificationToken)
        )
      })
    },
  }
}
