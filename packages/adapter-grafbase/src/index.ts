import type { Adapter, AdapterUser, AdapterAccount } from "next-auth/adapters"
import { GraphQLClient } from "graphql-request"

import {
  CreateUserMutation,
  GetUserByIdQuery,
  GetUserByEmailQuery,
  UpdateUserByIdMutation,
  DeleteUserByIdMutation,
  LinkAccountMutation,
  CreateSessionAndLinkUserMutation,
} from "./grafbase"
import { Session } from "next-auth"

export interface GrafbaseClientOptions {
  url: string
  /**
   * `x-api-key` header value
   */
  apiKey: string
}

export interface GrafbaseAdapterOptions {
  client: GrafbaseClientOptions
}

export function GrafbaseAdaper(options: GrafbaseClientOptions): Adapter {
  if (!options?.url) {
    throw new Error("You must provide an endpoint for your Grafbase project")
  }

  if (process.env.NODE_ENV === "production" && !options?.apiKey) {
    throw new Error("You must provide an API key for your Grafbase project")
  }

  const client = new GraphQLClient(options.url, {
    headers: {
      "x-api-key": options.apiKey,
    },
  })

  return {
    async createUser(user) {
      const { userCreate } = await client.request<{
        userCreate: { user: AdapterUser }
      }>(CreateUserMutation, {
        user,
      })

      return userCreate?.user
    },
    async getUser(id) {
      const { user } = await client.request<{ user: AdapterUser }>(
        GetUserByIdQuery,
        {
          id,
        }
      )

      return user ?? null
    },
    async getUserByEmail(email) {
      const { user } = await client.request(GetUserByEmailQuery, {
        email,
      })

      return user ?? null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      // TODO: @unique scope
      return null
    },
    async updateUser({ id, ...user }) {
      const { updateUser } = await client.request<{
        updateUser: { user: AdapterUser }
      }>(UpdateUserByIdMutation, {
        id: id as string,
        user,
      })

      return updateUser?.user ?? null
    },
    async deleteUser(id) {
      await client.request(DeleteUserByIdMutation, {
        id,
      })

      return
    },
    async linkAccount(payload) {
      const {
        userId,
        access_token: accessToken,
        token_type: tokenType,
        id_token: idToken,
        refresh_token: refreshToken,
        expires_at: expiresAt,
        session_state: sessionState,
        ...account
      } = payload

      const { accountCreate } = await client.request<{
        accountCreate: { account: AdapterAccount }
      }>(LinkAccountMutation, {
        input: {
          userId,
          accessToken,
          tokenType,
          idToken,
          refreshToken,
          expiresAt,
          sessionState,
          ...account,
          user: {
            link: userId,
          },
        },
      })

      return accountCreate?.account ?? null
    },
    async unlinkAccount({ providerAccountId, provider }) {
      // TODO: @unique scope
      return
    },
    async createSession({ userId, ...payload }) {
      const { sessionCreate } = await client.request(
        CreateSessionAndLinkUserMutation,
        {
          input: {
            ...payload,
            user: {
              link: userId,
            },
          },
        }
      )

      return {
        ...sessionCreate?.session,
        ...payload,
        userId,
      }
    },
    async getSessionAndUser(sessionToken) {
      // TODO: Filter/scope or workaround

      return null
    },
    async updateSession({ sessionToken, ...data }) {
      // TODO: UpdateSessionBySessionTokenMutation
      return null
    },
    async deleteSession(sessionToken) {
      // TODO: DeleteSessionBySessionTokenMutation
      return null
    },
    async useVerificationToken(token) {
      return null
    },
  }
}
