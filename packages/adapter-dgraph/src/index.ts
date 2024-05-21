/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://dgraph.io/docs">Dgraph</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://dgraph.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/dgraph.svg" width="100"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install next-auth @auth/dgraph-adapter
 * ```
 *
 * @module @auth/dgraph-adapter
 */
import { client as dgraphClient } from "./lib/client.js"
import { isDate, type Adapter } from "@auth/core/adapters"
import type { DgraphClientParams } from "./lib/client.js"
import * as defaultFragments from "./lib/graphql/fragments.js"
import { AdapterAccount, AdapterSession, AdapterUser, VerificationToken } from "@auth/core/adapters"

export type { DgraphClientParams, DgraphClientError } from "./lib/client.js"

/** This is the interface of the Dgraph adapter options. */
export interface DgraphAdapterOptions {
  /**
   * The GraphQL {@link https://dgraph.io/docs/query-language/fragments/ Fragments} you can supply to the adapter
   * to define how the shapes of the `user`, `account`, `session`, `verificationToken` entities look.
   *
   * By default the adapter will uses the [default defined fragments](https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-dgraph/src/lib/graphql/fragments.ts)
   * , this config option allows to extend them.
   */
  fragments?: {
    User?: string
    Account?: string
    Session?: string
    VerificationToken?: string
  }
}

export function DgraphAdapter(
  client: DgraphClientParams,
  options?: DgraphAdapterOptions
): Adapter {
  const c = dgraphClient(client)

  const fragments = { ...defaultFragments, ...options?.fragments }
  return {
    async createUser(input: AdapterUser) {
      const result = await c.run<{ user: any[] }>(
        /* GraphQL */ `
          mutation ($input: [AddUserInput!]!) {
            addUser(input: $input) {
              user {
                ...UserFragment
              }
            }
          }
          ${fragments.User}
        `,
        { input }
      )

      return format.from<any>(result?.user[0])
    },
    async getUser(id: string) {
      const result = await c.run<any>(
        /* GraphQL */ `
          query ($id: ID!) {
            getUser(id: $id) {
              ...UserFragment
            }
          }
          ${fragments.User}
        `,
        { id }
      )

      return format.from<any>(result)
    },
    async getUserByEmail(email: string) {
      const [user] = await c.run<any>(
        /* GraphQL */ `
          query ($email: String = "") {
            queryUser(filter: { email: { eq: $email } }) {
              ...UserFragment
            }
          }
          ${fragments.User}
        `,
        { email }
      )
      return format.from<any>(user)
    },
    async getUserByAccount(provider_providerAccountId: { provider: string, providerAccountId: string }) {
      const [account] = await c.run<any>(
        /* GraphQL */ `
          query ($providerAccountId: String = "", $provider: String = "") {
            queryAccount(
              filter: {
                and: {
                  providerAccountId: { eq: $providerAccountId }
                  provider: { eq: $provider }
                }
              }
            ) {
              user {
                ...UserFragment
              }
              id
            }
          }
          ${fragments.User}
        `,
        provider_providerAccountId
      )
      return format.from<any>(account?.user)
    },
    async updateUser({ id, ...input }: { id: string }) {
      const result = await c.run<any>(
        /* GraphQL */ `
          mutation ($id: [ID!] = "", $input: UserPatch) {
            updateUser(input: { filter: { id: $id }, set: $input }) {
              user {
                ...UserFragment
              }
            }
          }
          ${fragments.User}
        `,
        { id, input }
      )
      return format.from<any>(result.user[0])
    },
    async deleteUser(id: string) {
      const result = await c.run<any>(
        /* GraphQL */ `
          mutation ($id: [ID!] = "") {
            deleteUser(filter: { id: $id }) {
              numUids
              user {
                accounts {
                  id
                }
                sessions {
                  id
                }
              }
            }
          }
        `,
        { id }
      )

      const deletedUser = format.from<any>(result.user[0])

      await c.run<any>(
        /* GraphQL */ `
          mutation ($accounts: [ID!], $sessions: [ID!]) {
            deleteAccount(filter: { id: $accounts }) {
              numUids
            }
            deleteSession(filter: { id: $sessions }) {
              numUids
            }
          }
        `,
        {
          sessions: deletedUser.sessions.map((x: any) => x.id),
          accounts: deletedUser.accounts.map((x: any) => x.id),
        }
      )

      return deletedUser
    },

    async linkAccount(data: AdapterAccount) {
      const { userId, ...input } = data
      await c.run<any>(
        /* GraphQL */ `
          mutation ($input: [AddAccountInput!]!) {
            addAccount(input: $input) {
              account {
                ...AccountFragment
              }
            }
          }
          ${fragments.Account}
        `,
        { input: { ...input, user: { id: userId } } }
      )
      return data
    },
    async unlinkAccount(provider_providerAccountId: { provider: string, providerAccountId: string }) {
      await c.run<any>(
        /* GraphQL */ `
          mutation ($providerAccountId: String = "", $provider: String = "") {
            deleteAccount(
              filter: {
                and: {
                  providerAccountId: { eq: $providerAccountId }
                  provider: { eq: $provider }
                }
              }
            ) {
              numUids
            }
          }
        `,
        provider_providerAccountId
      )
    },

    async getSessionAndUser(sessionToken: string) {
      const [sessionAndUser] = await c.run<any>(
        /* GraphQL */ `
          query ($sessionToken: String = "") {
            querySession(filter: { sessionToken: { eq: $sessionToken } }) {
              ...SessionFragment
              user {
                ...UserFragment
              }
            }
          }
          ${fragments.User}
          ${fragments.Session}
        `,
        { sessionToken }
      )
      if (!sessionAndUser) return null

      const { user, ...session } = sessionAndUser

      return {
        user: format.from<any>(user),
        session: { ...format.from<any>(session), userId: user.id },
      }
    },
    async createSession(data: AdapterSession) {
      const { userId, ...input } = data

      await c.run<any>(
        /* GraphQL */ `
          mutation ($input: [AddSessionInput!]!) {
            addSession(input: $input) {
              session {
                ...SessionFragment
              }
            }
          }
          ${fragments.Session}
        `,
        { input: { ...input, user: { id: userId } } }
      )

      return data as any
    },
    async updateSession({ sessionToken, ...input }: { sessionToken: string }) {
      const result = await c.run<any>(
        /* GraphQL */ `
          mutation ($input: SessionPatch = {}, $sessionToken: String) {
            updateSession(
              input: {
                filter: { sessionToken: { eq: $sessionToken } }
                set: $input
              }
            ) {
              session {
                ...SessionFragment
                user {
                  id
                }
              }
            }
          }
          ${fragments.Session}
        `,
        { sessionToken, input }
      )
      const session = format.from<any>(result.session[0])

      if (!session?.user?.id) return null

      return { ...session, userId: session.user.id }
    },
    async deleteSession(sessionToken: string) {
      await c.run<any>(
        /* GraphQL */ `
          mutation ($sessionToken: String = "") {
            deleteSession(filter: { sessionToken: { eq: $sessionToken } }) {
              numUids
            }
          }
        `,
        { sessionToken }
      )
    },

    async createVerificationToken(input: VerificationToken) {
      const result = await c.run<any>(
        /* GraphQL */ `
          mutation ($input: [AddVerificationTokenInput!]!) {
            addVerificationToken(input: $input) {
              numUids
            }
          }
        `,
        { input }
      )
      return format.from<any>(result)
    },

    async useVerificationToken(params: { identifier: string; token: string }) {
      const result = await c.run<any>(
        /* GraphQL */ `
          mutation ($token: String = "", $identifier: String = "") {
            deleteVerificationToken(
              filter: {
                and: { token: { eq: $token }, identifier: { eq: $identifier } }
              }
            ) {
              verificationToken {
                ...VerificationTokenFragment
              }
            }
          }
          ${fragments.VerificationToken}
        `,
        params
      )

      return format.from<any>(result.verificationToken[0])
    },
  }
}

export const format = {
  from<T>(object?: Record<string, any>): T | null {
    const newObject: Record<string, unknown> = {}
    if (!object) return null
    for (const key in object) {
      const value = object[key]
      if (isDate(value)) {
        newObject[key] = new Date(value)
      } else {
        newObject[key] = value
      }
    }

    return newObject as T
  },
}
