/**
 * ## Installation
 *
 * ```bash
 * pnpm install @auth/redis-cache-adapter
 * ```
 *
 * @module @auth/redis-cache-adapter
 */

import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"
import {
  RedisClientType,
  SetOptions,
} from "@redis/client"

const relation_fields: Record<string, string[]> = {
  User: ["accounts", "sessions", "Authenticator"],
  Account: ["user"],
  Session: ["user"],
  Authenticator: ["user"],
}

/**
 * Create an adapter that uses Redis for caching database.
 *
 * @param adapter - The adapter to cache.
 * @param redis_client - The Redis client instance.
 * @param redis_namespace - The namespace to use for Redis keys.
 * @param redis_expiry - The expiry time for Redis keys.
 * @returns The adapter.
 */
export function RedisCacheAdapter(
  adapter: Adapter,
  redis_client: any,
  redis_namespace: string,
  redis_expiry: number
) {
  const keys_expiration = {
    expiration: {
      type: "EX",
      value: redis_expiry,
    },
  } as SetOptions

  const redis = redis_client as RedisClientType

  return {
    async createUser(user: AdapterUser): Promise<AdapterUser> {
      const created_user = await adapter.createUser!(user)

      const user_key = `${redis_namespace}:user:${created_user.id}`
      await redis.set(
        user_key,
        JSON.stringify(strip_relations("User", created_user)),
        keys_expiration
      )

      if (created_user.email) {
        const email_key = `${redis_namespace}:user:email:${created_user.email}`
        await redis.set(email_key, created_user.id, keys_expiration)
      }

      return created_user
    },
    async getUser(id: string): Promise<AdapterUser | null> {
      const user = await redis.get(`${redis_namespace}:user:${id}`)
      if (user) return JSON.parse(user) as AdapterUser

      const data = await adapter.getUser!(id)
      if (data) {
        await redis.set(
          `${redis_namespace}:user:${id}`,
          JSON.stringify(strip_relations("User", data)),
          keys_expiration
        )
        return data
      }

      return null
    },
    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const email_key = `${redis_namespace}:user:email:${email}`

      const user_id = await redis.get(email_key)
      if (user_id) {
        const user_key = `${redis_namespace}:user:${user_id}`
        const cached_user = await redis.get(user_key)

        if (cached_user) return JSON.parse(cached_user) as AdapterUser
      }

      const user = await adapter.getUserByEmail!(email)
      if (!user) return null

      await redis.set(email_key, user.id, keys_expiration)
      await redis.set(
        `${redis_namespace}:user:${user.id}`,
        JSON.stringify(strip_relations("User", user)),
        keys_expiration
      )

      return user
    },
    async getUserByAccount(
      provider_id: Pick<AdapterAccount, "provider" | "providerAccountId">
    ): Promise<AdapterUser | null> {
      const { provider, providerAccountId: account_id } = provider_id

      const account_key = `${redis_namespace}:account:${provider}:${account_id}`
      let account = await redis.get(account_key)

      if (!account) {
        const fetched_account = await adapter.getAccount!(account_id, provider)

        if (!fetched_account) return null

        await redis.set(
          account_key,
          JSON.stringify(strip_relations("Account", fetched_account)),
          keys_expiration
        )
        account = JSON.stringify(fetched_account)
      }

      const parsed_account = JSON.parse(account) as AdapterAccount
      const user_id = parsed_account.userId

      const user_key = `${redis_namespace}:user:${user_id}`
      const user = await redis.get(user_key)

      if (!user) {
        const fetched_user = await adapter.getUser!(user_id)

        if (!fetched_user) return null

        await redis.set(
          user_key,
          JSON.stringify(strip_relations("User", fetched_user)),
          keys_expiration
        )

        return fetched_user as AdapterUser
      }

      return JSON.parse(user) as AdapterUser
    },
    async updateUser(
      user: Partial<AdapterUser> & Pick<AdapterUser, "id">
    ): Promise<AdapterUser> {
      const updated_user = await adapter.updateUser!(user)

      if (updated_user.email) {
        const email_key = `${redis_namespace}:user:email:${updated_user.email}`
        await redis.set(email_key, updated_user.id, keys_expiration)
      }

      const user_key = `${redis_namespace}:user:${updated_user.id}`
      await redis.set(
        user_key,
        JSON.stringify(strip_relations("User", updated_user)),
        keys_expiration
      )

      return updated_user
    },
    deleteUser(
      user_id: string
    ): Promise<void> | Promise<AdapterUser | null | undefined> {
      return Promise.resolve(adapter.deleteUser!(user_id)).then(
        async (deleted_user) => {
          if (!deleted_user) return null

          const user_key = `${redis_namespace}:user:${user_id}`
          await redis.del(user_key)

          if (deleted_user && deleted_user.email) {
            const email_key = `${redis_namespace}:user:email:${deleted_user.email}`
            await redis.del(email_key)
          }

          return deleted_user
        }
      ) as Promise<AdapterUser | null | undefined>
    },

    linkAccount(
      account: AdapterAccount
    ): Promise<void> | Promise<AdapterAccount | null | undefined> {
      const { provider, providerAccountId: account_id } = account

      return Promise.resolve(adapter.linkAccount!(account)).then(
        async (linked_account) => {
          if (!linked_account) return null

          const account_key = `${redis_namespace}:account:${provider}:${account_id}`
          await redis.set(
            account_key,
            JSON.stringify(strip_relations("Account", linked_account)),
            keys_expiration
          )

          return linked_account
        }
      ) as Promise<AdapterAccount | null | undefined>
    },
    unlinkAccount(
      provider_id: Pick<AdapterAccount, "provider" | "providerAccountId">
    ): Promise<void> | Promise<AdapterAccount | undefined> {
      const { provider, providerAccountId: account_id } = provider_id

      return Promise.resolve(adapter.unlinkAccount!(provider_id)).then(
        async (unlinked_account) => {
          if (!unlinked_account) return undefined

          const account_key = `${redis_namespace}:account:${provider}:${account_id}`
          await redis.del(account_key)

          return unlinked_account
        }
      ) as Promise<AdapterAccount | undefined>
    },

    async getSessionAndUser(
      session_token: string
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const session_key = `${redis_namespace}:session:${session_token}`

      const fetched_session = await redis.get(session_key)
      if (fetched_session) {
        const parsed_session = JSON.parse(fetched_session) as AdapterSession

        const user_key = `${redis_namespace}:user:${parsed_session.userId}`
        const user = await redis.get(user_key)

        if (user) {
          return {
            session: parsed_session,
            user: JSON.parse(user) as AdapterUser,
          }
        }

        const user_data = await adapter.getUser!(parsed_session.userId)
        if (!user_data) return null

        await redis.set(
          user_key,
          JSON.stringify(strip_relations("User", user_data)),
          keys_expiration
        )

        return {
          session: parsed_session,
          user: user_data as AdapterUser,
        }
      }

      const session_data = await adapter.getSessionAndUser!(session_token)
      if (!session_data) return null

      const { user, session } = session_data
      const user_key = `${redis_namespace}:user:${user.id}`

      await redis.set(session_key, JSON.stringify(session), keys_expiration)
      await redis.set(
        user_key,
        JSON.stringify(strip_relations("User", user)),
        keys_expiration
      )

      return { session, user }
    },
    async createSession(session: {
      sessionToken: string
      userId: string
      expires: Date
    }): Promise<AdapterSession> {
      const session_token = session.sessionToken

      const created_session = await adapter.createSession!(session)

      const session_key = `${redis_namespace}:session:${session_token}`
      await redis.set(
        session_key,
        JSON.stringify(created_session),
        keys_expiration
      )

      return created_session
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const updated_session = await adapter.updateSession!(session)
      if (!updated_session) return null

      const session_key = `${redis_namespace}:session:${updated_session.sessionToken}`
      await redis.set(
        session_key,
        JSON.stringify(updated_session),
        keys_expiration
      )

      return updated_session
    },
    deleteSession(
      session_token: string
    ): Promise<void> | Promise<AdapterSession | null | undefined> {
      return Promise.resolve(adapter.deleteSession!(session_token)).then(
        async (deleted_session) => {
          if (!deleted_session) return null

          const session_key = `${redis_namespace}:session:${session_token}`
          await redis.del(session_key)

          return deleted_session
        }
      ) as Promise<AdapterSession | null | undefined>
    },

    // For verification tokens, we don't need to cache them in Redis
    async createVerificationToken(
      verification_token: VerificationToken
    ): Promise<VerificationToken | null | undefined> {
      return adapter.createVerificationToken!(verification_token)
    },
    async useVerificationToken(params: {
      identifier: string
      token: string
    }): Promise<VerificationToken | null> {
      return adapter.useVerificationToken!(params)
    },

    async getAccount(
      provider_account_id: AdapterAccount["providerAccountId"],
      provider: AdapterAccount["provider"]
    ): Promise<AdapterAccount | null> {
      const account_key = `${redis_namespace}:account:${provider}:${provider_account_id}`
      let account = await redis.get(account_key)

      if (!account) {
        const fetched_account = await adapter.getAccount!(
          provider_account_id,
          provider
        )
        if (!fetched_account) return null

        await redis.set(
          account_key,
          JSON.stringify(strip_relations("Account", fetched_account)),
          keys_expiration
        )
        account = JSON.stringify(fetched_account)
      }

      return JSON.parse(account) as AdapterAccount
    },

    async createAuthenticator(
      authenticator: AdapterAuthenticator
    ): Promise<AdapterAuthenticator> {
      const created_authenticator =
        await adapter.createAuthenticator!(authenticator)

      const authenticator_key = `${redis_namespace}:authenticator:${authenticator.credentialID}`
      await redis.set(
        authenticator_key,
        JSON.stringify(strip_relations("Authenticator", created_authenticator)),
        keys_expiration
      )

      return created_authenticator
    },
    async getAuthenticator(
      credential_id: string
    ): Promise<AdapterAuthenticator | null> {
      const authenticator_key = `${redis_namespace}:authenticator:${credential_id}`
      let authenticator = await redis.get(authenticator_key)

      if (!authenticator) {
        const fetched_authenticator =
          await adapter.getAuthenticator!(credential_id)
        if (!fetched_authenticator) return null

        await redis.set(
          authenticator_key,
          JSON.stringify(
            strip_relations("Authenticator", fetched_authenticator)
          ),
          keys_expiration
        )
        authenticator = JSON.stringify(fetched_authenticator)
      }

      return JSON.parse(authenticator) as AdapterAuthenticator
    },
    async listAuthenticatorsByUserId(
      user_id: string
    ): Promise<AdapterAuthenticator[]> {
      return adapter.listAuthenticatorsByUserId!(user_id)
    },
    async updateAuthenticatorCounter(
      credential_id: AdapterAuthenticator["credentialID"],
      new_counter: AdapterAuthenticator["counter"]
    ): Promise<AdapterAuthenticator> {
      return adapter.updateAuthenticatorCounter!(credential_id, new_counter)
    },
  }
}

/** Remove undefined fields from the data object */
function strip_undefined<T>(obj: T) {
  const data = {} as T
  for (const key in obj) if (obj[key] !== undefined) data[key] = obj[key]
  return { data }
}

/** Remove relation fields from the data object, useful for caching */
function strip_relations<T extends Record<string, any>>(
  model_name: string,
  data: T
): Partial<T> {
  if (!relation_fields[model_name]) return data

  const filtered_data = { ...data }
  for (const field of relation_fields[model_name]) {
    delete filtered_data[field]
  }

  return strip_undefined(filtered_data).data
}
