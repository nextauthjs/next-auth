/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  Official <a href="https://triplit.dev/docs">Triplit</a> adapter for Auth.js / NextAuth.js.
 *  <a href="https://triplit.dev/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/triplit.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @triplit/client @auth/triplit-adapter
 * ```
 *
 * @module @auth/triplit-adapter
 */
import type { Adapter, AdapterSession, AdapterUser } from "@auth/core/adapters"
import { HttpClient } from "@triplit/client"
import { Models } from "@triplit/db"

export type TriplitAdapterConnectionOptions = {
  server: string
  token: string
  schema?: Models<any, any>
  sessionCollectionName?: string
  userCollectionName?: string
  accountCollectionName?: string
  verificationRequestCollectionName?: string
}

/**
 * ## Setup
 *
 * ### Configure Auth.js
 *
 * Add this adapter to your `pages/api/[...nextauth].js`` next-auth configuration object.
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { TriplitAdapter } from "@triplit/authjs-adapter"
 * import { schema } from "path/to/triplit/schema"
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/core#authconfig
 * export default NextAuth({
 *   // https://authjs.dev/reference/core/providers
 *   providers: [...],
 *   adapter: TriplitAdapter({
 *     server: process.env.TRIPLIT_DB_URL,
 *     token: process.env.TRIPLIT_SERVICE_TOKEN,
 *     schema: schema
 *   }),
 *   // ...
 * })
 * ```
 *
 * ### Setup the NextAuth schema
 *
 * Add the following schema to your Triplit database. The schema is described [here](https://authjs.dev/reference/core/adapters#models).
 *
 * In your `triplit/schema.ts` file, add the following collections:
 *
 * ```
 * {
 *     users: {
 *         schema: S.Schema({
 *             id: S.Id(),
 *             name: S.String({ nullable: true, default: null }),
 *             email: S.String({ nullable: true, default: null }),
 *             emailVerified: S.Date({ nullable: true, default: null }),
 *             image: S.String({ nullable: true, default: null }),
 *         }),
 *     },
 *     accounts: {
 *         schema: S.Schema({
 *             id: S.Id(),
 *             userId: S.String(),
 *             user: S.RelationById("users", "$userId"),
 *             type: S.String(),
 *             provider: S.String(),
 *             providerAccountId: S.String(),
 *             refresh_token: S.String({ nullable: true, default: null }),
 *             access_token: S.String({ nullable: true, default: null }),
 *             expires_at: S.Number({ nullable: true, default: null }),
 *             token_type: S.String({ nullable: true, default: null }),
 *             scope: S.String({ nullable: true, default: null }),
 *             id_token: S.String({ nullable: true, default: null }),
 *             session_state: S.String({ nullable: true, default: null }),
 *         }),
 *     },
 *     sessions: {
 *         schema: S.Schema({
 *             id: S.Id(),
 *             userId: S.String(),
 *             S.RelationById("users", "$userId"),
 *             expires: S.Date(),
 *             sessionToken: S.String(),
 *         }),
 *     },
 *     verificationTokens: {
 *         schema: S.Schema({
 *             id: S.Id(),
 *             identifier: S.String(),
 *             token: S.String(),
 *             expires: S.Date(),
 *         }),
 *     },
 * }
 * ```
 *
 * In [local development](https://www.triplit.dev/docs/guides/local-development), the Auth.js models should be available for use.
 *
 * ### Managing user JWTs
 *
 * Configure Auth.js to use JWTs and assign them proper fields.
 *
 * To sign the JWT, install the `jose` package:
 *
 * ```bash npm2yarn
 * npm install jose
 * ```
 *
 * Using [Auth.js callbacks](https://authjs.dev/reference/core/types#callbacksoptionsp-a), create a valid token and append it to the `session` object.
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { TriplitAdapter } from "@auth/triplit-adapter"
 * import * as jwt from "jose"
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/configuration/auth-options
 * export default NextAuth({
 *  // https://authjs.dev/reference/core/providers
 *  providers: [...],
 *   adapter: TriplitAdapter({...}),
 *   session: {
 *     strategy: "jwt" as const,
 *   },
 *   jwt: {
 *     secret: process.env.NEXTAUTH_SECRET,
 *     encode: async ({ secret, token, maxAge }) => {
 *       return await signToken(token, secret);
 *     },
 *     decode: async ({ secret, token }) => {
 *       return await decodeToken(token!, secret)
 *     },
 *   },
 *   callbacks: {
 *     jwt: async ({ token, user }) => {
 *       if (user) {
 *         token["x-triplit-user-id"] = user.id
 *       }
 *       token["x-triplit-project-id"] = process.env.TRIPLIT_PROJECT_ID
 *       token["x-triplit-token-type"] = "external"
 *       return token
 *     },
 *     async session({ session, token, user }) {
 *       if (process.env.NEXTAUTH_SECRET) {
 *         session.token = await signToken(token, process.env.NEXTAUTH_SECRET)
 *       }
 *       if (session.user) {
 *         session.user.id = token[“x-triplit-user-id”]
 *       }
 *       return session
 *     },
 *   },
 *   // ...
 * });
 *
 * async function signToken(token: any, secret: string) {
 *   const alg = "HS256"
 *   const secretKey = new TextEncoder().encode(secret)
 *   const encodedToken = await new jwt.SignJWT(token)
 *     .setIssuedAt()
 *     .setExpirationTime("24h")
 *     .setProtectedHeader({ alg })
 *     .sign(secretKey)
 *   return encodedToken
 * }
 *
 * async function decodeToken(token: string, secret: string) {
 *   const secretKey = new TextEncoder().encode(secret)
 *   const decodedToken = await jwt.jwtVerify(token, secretKey, {
 *     algorithms: ["HS256"],
 *   })
 *   return decodedToken.payload
 * }
 * ```
 *
 * ## Example
 *
 * Check out Triplit's [example chat app](https://github.com/aspen-cloud/triplit/tree/main/templates/chat-template) for a full example.
 */
export function TriplitAdapter(
  options: TriplitAdapterConnectionOptions
): Adapter {
  const client = new HttpClient({
    server: options.server,
    token: options.token,
    schema: options.schema,
  })
  const collectionNames = {
    session: options.sessionCollectionName || "sessions",
    user: options.userCollectionName || "users",
    account: options.accountCollectionName || "accounts",
    verificationRequest:
      options.verificationRequestCollectionName || "verificationTokens",
  }

  return {
    async createUser(user) {
      const result = await client.insert(collectionNames.user, user)
      return result?.output
    },
    async getUser(id) {
      const user = ((await client.fetchById(collectionNames.user, id)) ??
        null) as AdapterUser | null
      return user
    },
    async getUserByEmail(email) {
      const user = await client.fetchOne({
        collectionName: collectionNames.user,
        where: [["email", "=", email]],
      })
      return user
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client.fetchOne({
        collectionName: collectionNames.account,
        where: [
          ["provider", "=", provider],
          ["providerAccountId", "=", providerAccountId],
        ],
        // We could make schema optional and do a manual join here
        include: { user: null },
      })
      return account?.user ?? null
    },
    async updateUser(user) {
      const { id, ...rest } = user
      await client.update(collectionNames.user, user.id, (entity) => {
        Object.entries(rest).forEach(([key, value]) => {
          entity[key] = value
        })
      })
      const updatedUser = await this.getUser!(id)
      if (!updatedUser) throw new Error("User not found")
      return updatedUser
    },
    async linkAccount(account) {
      const result = await client.insert(collectionNames.account, account)
      return result?.output
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const account = await client.fetchOne({
        collectionName: collectionNames.account,
        where: [
          ["provider", "=", provider],
          ["providerAccountId", "=", providerAccountId],
        ],
      })
      if (!account) return
      await client.delete(collectionNames.account, account.id)
      return account
    },
    async createSession(session) {
      const result = await client.insert(collectionNames.session, session)
      return result?.output
    },
    async getSessionAndUser(sessionToken) {
      const sessionWithUser = await client.fetchOne({
        collectionName: collectionNames.session,
        where: [["sessionToken", "=", sessionToken]],
        include: { user: null },
      })
      if (!sessionWithUser) return null
      const { user, ...session } = sessionWithUser
      if (!user) return null
      return { session, user }
    },
    async updateSession(newSession) {
      const session = await client.fetchOne({
        collectionName: collectionNames.session,
        where: [["sessionToken", "=", newSession.sessionToken]],
      })
      const sessionId = session?.id
      if (!session) return null
      await client.update(collectionNames.session, sessionId, (entity) => {
        Object.entries(newSession).forEach(([key, value]) => {
          entity[key] = value
        })
      })
      const updatedSession =
        ((await client.fetchById(
          "sessions",
          sessionId
        )) as unknown as AdapterSession) ?? null
      return updatedSession
    },
    async deleteSession(sessionToken) {
      const session = await client.fetchOne({
        collectionName: collectionNames.session,
        where: [["sessionToken", "=", sessionToken]],
      })
      const sessionId = session?.id
      if (!sessionId) return null
      await client.delete(collectionNames.session, sessionId)
      return session
    },
    async createVerificationToken(token) {
      const result = await client.insert(collectionNames.verificationRequest, {
        ...token,
        expires: token.expires,
      })
      return result?.output
    },
    async useVerificationToken({ identifier, token }) {
      const result = await client.fetchOne({
        collectionName: collectionNames.verificationRequest,
        where: [
          ["identifier", "=", identifier],
          ["token", "=", token],
        ],
      })
      if (!result) return null
      const { id, ...tokenResult } = result
      await client.delete(collectionNames.verificationRequest, id)
      return tokenResult
    },
    async deleteUser(userId) {
      const user = await client.fetchById(collectionNames.user, userId)
      if (!user) return null
      const sessions = await client.fetch({
        collectionName: collectionNames.session,
        where: [["userId", "=", userId]],
      })
      for (const [id] of sessions) {
        await client.delete(collectionNames.session, id)
      }
      const accounts = await client.fetch({
        collectionName: collectionNames.account,
        where: [["userId", "=", userId]],
      })
      for (const [id] of accounts) {
        await client.delete(collectionNames.account, id)
      }
      await client.delete(collectionNames.user, userId)
      return user as unknown as AdapterUser
    },
  }
}
