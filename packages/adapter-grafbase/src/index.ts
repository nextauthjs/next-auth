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

export interface GrafbaseClientOptions {
  /**
   * Grafbase API Endpoint
   *
   * The endpoint is provided by the Grafbase CLI, or via your project settings when deployed to the edge.
   *
   */
  url: string
  /**
   * `x-api-key` header value
   *
   * No API key is required when running the Grafbase CLI.
   */
  apiKey?: string
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
    ...(options?.apiKey && {
      headers: {
        "x-api-key": options.apiKey,
      },
    }),
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
      const { user } = await client.request<{ user: AdapterUser }>(
        GetUserByEmailQuery,
        {
          email,
        }
      )

      return user ?? null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      // TODO: @unique scope
      throw new Error("`getUserByAccount` not implemented")
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
      throw new Error("`unlinkAccount` not implemented")
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
      throw new Error("`getSessionAndUser` not implemented")
    },
    async updateSession({ sessionToken, ...data }) {
      throw new Error("`updateSession` not implemented")
    },
    async deleteSession(sessionToken) {
      throw new Error("`deleteSession` not implemented")
    },
    async useVerificationToken(token) {
      throw new Error("`useVerificationToken` not implemented")
    },
  }
}
