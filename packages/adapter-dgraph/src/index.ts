/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://docs.aws.amazon.com/dynamodb/index.html">DynamoDB</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://aws.amazon.com/dynamodb/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/dynamodb.png" height="30"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @next-auth/dynamodb-adapter @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
 * ```
 *
 * @module @next-auth/dynamodb-adapter
 */
import { client as dgraphClient } from "./client"
import { format } from "./utils"
import type { Adapter } from "next-auth/adapters"
import type { DgraphClientParams } from "./client"
import * as defaultFragments from "./graphql/fragments"

export type { DgraphClientParams, DgraphClientError } from "./client"

/** This is the interface of the Dgraph adapter options. */
export interface DgraphAdapterOptions {
  /**
   * The GraphQL {@link https://dgraph.io/docs/query-language/fragments/ Fragments} you can supply to the adapter
   * to define how the shapes of the `user`, `account`, `session`, `verificationToken` entities look.
   *
   * By default the adapter will uses the [default defined fragments](https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-dgraph/src/graphql/fragments.ts)
   * , this config option allows to extend them.
   */
  fragments?: {
    User?: string
    Account?: string
    Session?: string
    VerificationToken?: string
  }
}

export { format }

/**
 * ### Basic usage
 *
 * Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object:
 *
 * ```ts title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { DgraphAdapter } from "@next-auth/dgraph-adapter"
 *
 * export default NextAuth({
 *   providers: [],
 *   adapter: DgraphAdapter({
 *     endpoint: process.env.DGRAPH_GRAPHQL_ENDPOINT,
 *     authToken: process.env.DGRAPH_GRAPHQL_KEY,
 *     // you can omit the following properties if you are running an unsecure schema
 *     authHeader: process.env.AUTH_HEADER, // default: "Authorization",
 *     jwtSecret: process.env.SECRET,
 *   }),
 * })
 * ```
 * ### Unsecure schema
 *
 * The quickest way to use Dgraph is by applying the unsecure schema to your [local](https://dgraph.io/docs/graphql/admin/#modifying-a-schema) Dgraph instance or if using Dgraph [cloud](https://dgraph.io/docs/cloud/cloud-quick-start/#the-schema) you can paste the schema in the codebox to update.
 *
 * :::warning
 * This approach is not secure or for production use, and does not require a `jwtSecret`.
 * :::
 *
 * > This schema is adapted for use in Dgraph and based upon our main [schema](/reference/adapters/models)
 *
 * #### Example
 *
 *```graphql
 *  type Account {
 *    id: ID
 *    type: String
 *    provider: String @search(by: [hash])
 *    providerAccountId: String @search(by: [hash])
 *    refreshToken: String
 *    expires_at: Int64
 *    accessToken: String
 *    token_type: String
 *    refresh_token: String
 *    access_token: String
 *    scope: String
 *    id_token: String
 *    session_state: String
 *    user: User @hasInverse(field: "accounts")
 *  }
 *  type Session {
 *    id: ID
 *    expires: DateTime
 *    sessionToken: String @search(by: [hash])
 *    user: User @hasInverse(field: "sessions")
 *  }
 *  type User {
 *    id: ID
 *    name: String
 *    email: String @search(by: [hash])
 *    emailVerified: DateTime
 *    image: String
 *    accounts: [Account] @hasInverse(field: "user")
 *    sessions: [Session] @hasInverse(field: "user")
 *  }
 *
 *  type VerificationToken {
 *    id: ID
 *    identifier: String @search(by: [hash])
 *    token: String @search(by: [hash])
 *    expires: DateTime
 *  }
 *```
 * ### Secure schema
 *
 * For production deployments you will want to restrict the access to the types used
 * by next-auth. The main form of access control used in Dgraph is via `@auth` directive alongside types in the schema.
 * #### Example
 *
 * ```graphql
 * type Account
 *   @auth(
 *     delete: { rule: "{$nextAuth: { eq: true } }" }
 *     add: { rule: "{$nextAuth: { eq: true } }" }
 *     query: { rule: "{$nextAuth: { eq: true } }" }
 *     update: { rule: "{$nextAuth: { eq: true } }" }
 *   ) {
 *   id: ID
 *   type: String
 *   provider: String @search(by: [hash])
 *   providerAccountId: String @search(by: [hash])
 *   refreshToken: String
 *   expires_at: Int64
 *   accessToken: String
 *   token_type: String
 *   refresh_token: String
 *   access_token: String
 *   scope: String
 *   id_token: String
 *   session_state: String
 *   user: User @hasInverse(field: "accounts")
 * }
 * type Session
 *   @auth(
 *     delete: { rule: "{$nextAuth: { eq: true } }" }
 *     add: { rule: "{$nextAuth: { eq: true } }" }
 *     query: { rule: "{$nextAuth: { eq: true } }" }
 *     update: { rule: "{$nextAuth: { eq: true } }" }
 *   ) {
 *   id: ID
 *   expires: DateTime
 *   sessionToken: String @search(by: [hash])
 *   user: User @hasInverse(field: "sessions")
 * }
 * type User
 *   @auth(
 *     query: {
 *       or: [
 *         {
 *           rule: """
 *           query ($userId: String!) {queryUser(filter: { id: { eq: $userId } } ) {id}}
 *           """
 *         }
 *         { rule: "{$nextAuth: { eq: true } }" }
 *       ]
 *     }
 *     delete: { rule: "{$nextAuth: { eq: true } }" }
 *     add: { rule: "{$nextAuth: { eq: true } }" }
 *     update: {
 *       or: [
 *         {
 *           rule: """
 *           query ($userId: String!) {queryUser(filter: { id: { eq: $userId } } ) {id}}
 *           """
 *         }
 *         { rule: "{$nextAuth: { eq: true } }" }
 *       ]
 *     }
 *   ) {
 *   id: ID
 *   name: String
 *   email: String @search(by: [hash])
 *   emailVerified: DateTime
 *   image: String
 *   accounts: [Account] @hasInverse(field: "user")
 *   sessions: [Session] @hasInverse(field: "user")
 * }
 *
 * type VerificationToken
 *   @auth(
 *     delete: { rule: "{$nextAuth: { eq: true } }" }
 *     add: { rule: "{$nextAuth: { eq: true } }" }
 *     query: { rule: "{$nextAuth: { eq: true } }" }
 *     update: { rule: "{$nextAuth: { eq: true } }" }
 *   ) {
 *   id: ID
 *   identifier: String @search(by: [hash])
 *   token: String @search(by: [hash])
 *   expires: DateTime
 * }
 *
 * # Dgraph.Authorization {"VerificationKey":"<YOUR JWT SECRET HERE>","Header":"<YOUR AUTH HEADER HERE>","Namespace":"<YOUR CUSTOM NAMESPACE HERE>","Algo":"HS256"}
 * ```
 *   ### Dgraph.Authorization
 *
 *  In order to secure your graphql backend define the `Dgraph.Authorization` object at the
 *  bottom of your schema and provide `authHeader` and `jwtSecret` values to the DgraphClient.
 *
 *  ```js
 *  # Dgraph.Authorization {"VerificationKey":"<YOUR JWT SECRET HERE>","Header":"<YOUR AUTH HEADER HERE>","Namespace":"YOUR CUSTOM NAMESPACE HERE","Algo":"HS256"}
 *  ```
 *
 *  ### VerificationKey and jwtSecret
 *
 *  This is the key used to sign the JWT. Ex. `process.env.SECRET` or `process.env.APP_SECRET`.
 *
 *  ### Header and authHeader
 *
 *  The `Header` tells Dgraph where to lookup a JWT within the headers of the incoming requests made to the dgraph server.
 *  You have to configure it at the bottom of your schema file. This header is the same as the `authHeader` property you
 *  provide when you instantiate the `DgraphClient`.
 *
 *  ### The nextAuth secret
 *
 *  The `$nextAuth` secret is securely generated using the `jwtSecret` and injected by the DgraphAdapter in order to allow interacting with the JWT DgraphClient for anonymous user requests made within the system `ie. login, register`. This allows
 *  secure interactions to be made with all the auth types required by next-auth. You have to specify it for each auth rule of
 *  each type defined in your secure schema.
 *
 *  ```js
 *  type VerificationRequest
 *    @auth(
 *      delete: { rule: "{$nextAuth: { eq: true } }" },
 *      add: { rule: "{$nextAuth: { eq: true } }" },
 *      query: { rule: "{$nextAuth: { eq: true } }" },
 *      update: { rule: "{$nextAuth: { eq: true } }" }
 *    ) {
 *   ...
 *  }
 *  ```
 *  ### JWT session and `@auth` directive
 *
 * Dgraph only works with HS256 or RS256 algorithms. If you want to use session jwt to securely interact with your dgraph
 * database you must customize next-auth `encode` and `decode` functions, as the default algorithm is HS512. You can
 * further customize the jwt with roles if you want to implement [`RBAC logic`](https://dgraph.io/docs/graphql/authorization/directive/#role-based-access-control).
 *
 * ```js
 * import * as jwt from "jsonwebtoken"
 * export default NextAuth({
 *   session: {
 *     strategy: "jwt",
 *   },
 *   jwt: {
 *     secret: process.env.SECRET,
 *     encode: async ({ secret, token }) => {
 *       return jwt.sign({ ...token, userId: token.id }, secret, {
 *         algorithm: "HS256",
 *         expiresIn: 30 * 24 * 60 * 60, // 30 days
 *       })
 *     },
 *     decode: async ({ secret, token }) => {
 *       return jwt.verify(token, secret, { algorithms: ["HS256"] })
 *     },
 *   },
 * })
 * ```
 *
 * Once your `Dgraph.Authorization` is defined in your schema and the JWT settings are set, this will allow you to define
 * [`@auth rules`](https://dgraph.io/docs/graphql/authorization/authorization-overview/) for every part of your schema.
 **/
export function DgraphAdapter(
  client: DgraphClientParams,
  options?: DgraphAdapterOptions
): Adapter {
  const c = dgraphClient(client)

  const fragments = { ...defaultFragments, ...options?.fragments }
  return {
    async createUser(input) {
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
    async getUser(id) {
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
    async getUserByEmail(email) {
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
    async getUserByAccount(provider_providerAccountId) {
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
    async updateUser({ id, ...input }) {
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
    async deleteUser(id) {
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

    async linkAccount(data) {
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
    async unlinkAccount(provider_providerAccountId) {
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

    async getSessionAndUser(sessionToken) {
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
    async createSession(data) {
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
    async updateSession({ sessionToken, ...input }) {
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
    async deleteSession(sessionToken) {
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

    async createVerificationToken(input) {
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

    async useVerificationToken(params) {
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
