import type {
  Adapter,
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import { GraphQLClient } from "graphql-request"

import {
  CreateUser,
  GetUser,
  GetUserByEmail,
  GetUserByAccount,
  UpdateUser,
  DeleteUser,
  LinkAccount,
  UnlinkAccount,
  CreateSession,
  GetSessionAndUser,
  UpdateSession,
  DeleteSession,
  CreateVerificationToken,
  UseVerificationToken,
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

export function GrafbaseAdapter(options: GrafbaseClientOptions): Adapter {
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
      }>(CreateUser, {
        user,
      })

      return userCreate?.user
    },
    async getUser(id) {
      const { user } = await client.request<{ user: AdapterUser }>(GetUser, {
        id,
      })

      return user ?? null
    },
    async getUserByEmail(email) {
      const { user } = await client.request<{ user: AdapterUser }>(
        GetUserByEmail,
        {
          email,
        }
      )

      return user ?? null
    },
    async getUserByAccount(provider_providerAccountId) {
      const { account } = await client.request<{
        account: AdapterAccount & {
          user: AdapterUser
        }
      }>(GetUserByAccount, {
        // TODO: @unique scope
        // provider_providerAccountId
        // REMOVE THIS VARIABLE WHEN @unique scope lands
        providerAccountId: provider_providerAccountId?.providerAccountId,
      })

      return account?.user
    },
    async updateUser({ id, ...user }) {
      const { updateUser } = await client.request<{
        updateUser: { user: AdapterUser }
      }>(UpdateUser, {
        id: id as string,
        user,
      })

      return updateUser?.user ?? null
    },
    async deleteUser(id) {
      await client.request(DeleteUser, {
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
      }>(LinkAccount, {
        input: {
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
    async unlinkAccount(provider_providerAccountId) {
      await client.request(UnlinkAccount, {
        // TODO: @unique scope
        // provider_providerAccountId
        // REMOVE THIS VARIABLE WHEN @unique scope lands
        providerAccountId: provider_providerAccountId?.providerAccountId,
      })
    },
    async createSession({ userId, ...payload }) {
      const { sessionCreate } = await client.request<{
        sessionCreate: {
          session: AdapterSession
        }
      }>(CreateSession, {
        input: {
          ...payload,
          user: {
            link: userId,
          },
        },
      })

      return {
        ...sessionCreate?.session,
        ...payload,
        userId,
      }
    },
    async getSessionAndUser(sessionToken) {
      const { session } = await client.request<{
        session: AdapterSession & {
          user: AdapterUser
        }
      }>(GetSessionAndUser, {
        sessionToken,
      })

      return {
        user: session.user,
        session: {
          ...session,
          expires: new Date(session.expires),
          userId: session.user.id,
        },
      }
    },
    async updateSession({ sessionToken, ...data }) {
      const { sessionUpdate } = await client.request<{
        sessionUpdate: {
          session: AdapterSession
        }
      }>(UpdateSession, {
        sessionToken,
        input: data,
      })

      return {
        ...sessionUpdate,
        sessionToken,
        userId: data.userId!,
        expires: data.expires!,
      }
    },
    async deleteSession(sessionToken) {
      await client.request(DeleteSession, {
        sessionToken,
      })

      return
    },
    async createVerificationToken(input) {
      const { createVerificationToken } = await client.request<{
        createVerificationToken: {
          verificationToken: VerificationToken
        }
      }>(CreateVerificationToken, { input })

      return createVerificationToken?.verificationToken
    },
    async useVerificationToken(token) {
      await client.request(UseVerificationToken, {
        token,
      })

      return {
        ...token,
        expires: new Date(),
      }
    },
  }
}
