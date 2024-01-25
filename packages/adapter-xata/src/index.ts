/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://xata.io/docs/overview">Xata</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://xata.io/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/xata.svg" width="50"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * # Install Auth.js and the Xata adapter
 * npm install @auth/xata-adapter
 *
 * # Install the Xata CLI globally if you don't already have it
 * npm install --location=global @xata.io/cli
 *
 * # Login
 * xata auth login
 * ```
 *
 * @module @auth/xata-adapter
 */
import type { Adapter } from "@auth/core/adapters"

import type { XataClient } from "./xata"

/**
 * ## Setup
 *
 * This adapter allows using Auth.js with Xata as a database to store users, sessions, and more. The preferred way to create a Xata project and use Xata databases is using the [Xata Command Line Interface (CLI)](https://docs.xata.io/cli/getting-started).
 *
 * The CLI allows generating a `XataClient` that will help you work with Xata in a safe way, and that this adapter depends on.
 *
 * When you're ready, let's create a new Xata project using our Auth.js schema that the Xata adapter can work with. To do that, copy and paste this schema file into your project's directory:
 *
 * ```json title="schema.json"
 * {
 *   "tables": [
 *     {
 *       "name": "nextauth_users",
 *       "columns": [
 *         {
 *           "name": "email",
 *           "type": "email"
 *         },
 *         {
 *           "name": "emailVerified",
 *           "type": "datetime"
 *         },
 *         {
 *           "name": "name",
 *           "type": "string"
 *         },
 *         {
 *           "name": "image",
 *           "type": "string"
 *         }
 *       ]
 *     },
 *     {
 *       "name": "nextauth_accounts",
 *       "columns": [
 *         {
 *           "name": "user",
 *           "type": "link",
 *           "link": {
 *             "table": "nextauth_users"
 *           }
 *         },
 *         {
 *           "name": "type",
 *           "type": "string"
 *         },
 *         {
 *           "name": "provider",
 *           "type": "string"
 *         },
 *         {
 *           "name": "providerAccountId",
 *           "type": "string"
 *         },
 *         {
 *           "name": "refresh_token",
 *           "type": "string"
 *         },
 *         {
 *           "name": "access_token",
 *           "type": "string"
 *         },
 *         {
 *           "name": "expires_at",
 *           "type": "int"
 *         },
 *         {
 *           "name": "token_type",
 *           "type": "string"
 *         },
 *         {
 *           "name": "scope",
 *           "type": "string"
 *         },
 *         {
 *           "name": "id_token",
 *           "type": "text"
 *         },
 *         {
 *           "name": "session_state",
 *           "type": "string"
 *         }
 *       ]
 *     },
 *     {
 *       "name": "nextauth_verificationTokens",
 *       "columns": [
 *         {
 *           "name": "identifier",
 *           "type": "string"
 *         },
 *         {
 *           "name": "token",
 *           "type": "string"
 *         },
 *         {
 *           "name": "expires",
 *           "type": "datetime"
 *         }
 *       ]
 *     },
 *     {
 *       "name": "nextauth_users_accounts",
 *       "columns": [
 *         {
 *           "name": "user",
 *           "type": "link",
 *           "link": {
 *             "table": "nextauth_users"
 *           }
 *         },
 *         {
 *           "name": "account",
 *           "type": "link",
 *           "link": {
 *             "table": "nextauth_accounts"
 *           }
 *         }
 *       ]
 *     },
 *     {
 *       "name": "nextauth_users_sessions",
 *       "columns": [
 *         {
 *           "name": "user",
 *           "type": "link",
 *           "link": {
 *             "table": "nextauth_users"
 *           }
 *         },
 *         {
 *           "name": "session",
 *           "type": "link",
 *           "link": {
 *             "table": "nextauth_sessions"
 *           }
 *         }
 *       ]
 *     },
 *     {
 *       "name": "nextauth_sessions",
 *       "columns": [
 *         {
 *           "name": "sessionToken",
 *           "type": "string"
 *         },
 *         {
 *           "name": "expires",
 *           "type": "datetime"
 *         },
 *         {
 *           "name": "user",
 *           "type": "link",
 *           "link": {
 *             "table": "nextauth_users"
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 * ```
 *
 * Now, run the following command:
 *
 * ```bash
 * xata init --schema=./path/to/your/schema.json
 * ```
 *
 * The CLI will walk you through a setup process where you choose a [workspace](https://xata.io/docs/api-reference/workspaces) (kind of like a GitHub org or a Vercel team) and an appropriate database. We recommend using a fresh database for this, as we'll augment it with tables that Auth.js needs.
 *
 * Once you're done, you can continue using Auth.js in your project as expected, like creating a `./pages/api/auth/[...nextauth]` route.
 *
 * ```typescript title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 *
 * const client = new XataClient()
 *
 * export default NextAuth({
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * Now to Xata-fy this route, let's add the Xata client and adapter:
 *
 * ```diff
 * import NextAuth from "next-auth"
 * import GoogleProvider from "next-auth/providers/google"
 * +import { XataAdapter } from "@auth/xata-adapter"
 * +import { XataClient } from "../../../xata" // or wherever you've chosen to create the client
 *
 * +const client = new XataClient()
 *
 * export default NextAuth({
 * + adapter: XataAdapter(client),
 *   providers: [
 *     GoogleProvider({
 *       clientId: process.env.GOOGLE_CLIENT_ID,
 *       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * This fully sets up your Auth.js app to work with Xata.
 */
export function XataAdapter(client: XataClient): Adapter {
  return {
    async createUser(user) {
      const newUser = await client.db.nextauth_users.create(user)
      return newUser
    },
    async getUser(id) {
      const user = await client.db.nextauth_users.filter({ id }).getFirst()
      return user ?? null
    },
    async getUserByEmail(email) {
      const user = await client.db.nextauth_users.filter({ email }).getFirst()
      return user ?? null
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await client.db.nextauth_users_accounts
        .select(["user.*"])
        .filter({
          "account.providerAccountId": providerAccountId,
          "account.provider": provider,
        })
        .getFirst()
      const user = result?.user
      return user ?? null
    },
    async updateUser(user) {
      const result = await client.db.nextauth_users.update(user.id!, user)
      return (
        result ?? {
          ...user,
          id: user.id!,
          emailVerified: user.emailVerified ?? null,
        }
      )
    },
    async deleteUser(id) {
      return await client.db.nextauth_users.delete(id)
    },
    async linkAccount(initialAccount) {
      const { userId, ...account } = initialAccount
      const newXataAccount = await client.db.nextauth_accounts.create({
        ...account,
        user: { id: userId },
      })
      await client.db.nextauth_users_accounts.create({
        user: { id: userId },
        account: { id: newXataAccount.id },
      })
    },
    async unlinkAccount({ providerAccountId, provider }) {
      /**
       * @todo refactor this when we support DELETE WHERE.
       */
      const connectedAccount = await client.db.nextauth_users_accounts
        .filter({
          "account.providerAccountId": providerAccountId,
          "account.provider": provider,
        })
        .getFirst()

      if (!connectedAccount) {
        return
      }
      return await client.db.nextauth_users_accounts.delete(connectedAccount.id)
    },
    async createSession(initialSession) {
      const { userId, ...session } = initialSession
      const newXataSession = await client.db.nextauth_sessions.create({
        ...session,
        user: { id: userId },
      })
      await client.db.nextauth_users_sessions.create({
        user: { id: userId },
        session: { id: newXataSession.id },
      })
      return { ...session, ...newXataSession, userId }
    },
    async getSessionAndUser(sessionToken) {
      const result = await client.db.nextauth_users_sessions
        .select(["user.*", "session.*"])
        .filter({ "session.sessionToken": sessionToken })
        .getFirst()
      if (!result?.session || !result?.user) {
        return null
      }

      return {
        session: {
          ...result.session,
          sessionToken: result.session.sessionToken!,
          expires: result.session.expires!,
          userId: result.user.id,
        },
        user: {
          ...result.user,
          emailVerified: result.user.emailVerified ?? null,
        },
      }
    },
    async updateSession({ sessionToken, ...data }) {
      const session = await client.db.nextauth_sessions
        .filter({ sessionToken })
        .getFirst()
      if (!session) {
        return null
      }

      await client.db.nextauth_sessions.update({ ...session, ...data })
      return {
        ...session,
        sessionToken,
        userId: data.userId!,
        expires: data.expires!,
      }
    },

    async deleteSession(sessionToken) {
      /**
       * @todo refactor this when we support DELETE WHERE.
       */
      const session = await client.db.nextauth_sessions
        .filter({ sessionToken })
        .getFirst()
      if (!session) {
        return
      }
      const connectedSession = await client.db.nextauth_users_sessions
        .filter({ "session.sessionToken": sessionToken })
        .getFirst()
      if (!connectedSession) {
        return
      }
      await client.db.nextauth_sessions.delete(session.id)
      await client.db.nextauth_users_sessions.delete(connectedSession.id)
    },
    async createVerificationToken(token) {
      await client.db.nextauth_verificationTokens.create({
        expires: token.expires,
        identifier: token.identifier,
        token: token.token,
      })
      return token
    },
    async useVerificationToken(token) {
      /**
       * @todo refactor this when we support DELETE WHERE.
       */
      const xataToken = await client.db.nextauth_verificationTokens
        .filter({ identifier: token.identifier, token: token.token })
        .getFirst()
      if (!xataToken) {
        return null
      }
      await client.db.nextauth_verificationTokens.delete(xataToken.id)
      return { ...token, expires: new Date() }
    },
  }
}
