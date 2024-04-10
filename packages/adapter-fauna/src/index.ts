/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p style={{fontWeight: "300"}}>Official <a href="https://docs.fauna.com/fauna/current/">Fauna</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://fauna.com/features">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/fauna.svg" height="30"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/fauna-adapter fauna
 * ```
 *
 * @module @auth/fauna-adapter
 */
import { Client, TimeStub, fql, NullDocument, QueryValue, QueryValueObject, Module } from "fauna"

import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
  AdapterAccount,
} from "@auth/core/adapters"

type ToFauna<T> = {
  [P in keyof T]: T[P] extends Date | null
    ? TimeStub | null
    : T[P] extends undefined
      ? null
      : T[P] extends QueryValue
        ? T[P]
        : QueryValueObject
}

export type FaunaUser = ToFauna<AdapterUser>
export type FaunaSession = ToFauna<AdapterSession>
export type FaunaVerificationToken = ToFauna<VerificationToken> & { id: string }
export type FaunaAccount = ToFauna<AdapterAccount>

type AdapterConfig = {
  collectionNames: {
    user: string
    session: string
    account: string
    verificationToken: string
  }
}

const defaultCollectionNames = {
  user: "User",
  session: "Session",
  account: "Account",
  verificationToken: "VerificationToken",
}

/**
 *
 * ## Setup
 *
 * This is the Fauna Adapter for [Auth.js](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` and other framework packages. It is not a standalone package.
 *
 * You can find the Fauna schema and seed information in the docs at [authjs.dev/reference/adapter/fauna](https://authjs.dev/reference/adapter/fauna).
 *
 * ### Configure Auth.js
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { Client } from "fauna"
 * import { FaunaAdapter } from "@auth/fauna-adapter"
 *
 * const client = new Client({
 *   secret: "secret",
 *   endpoint: new URL('http://localhost:8443')
 * })
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/configuration/auth-options
 * export default NextAuth({
 *   // https://authjs.dev/reference/providers/
 *   providers: [],
 *   adapter: FaunaAdapter(client)
 * })
 * ```
 *
 * ### Schema
 *
 * Run the following FQL code inside the `Shell` tab in the Fauna dashboard to set up the appropriate collections and indexes.
 *
 * ```javascript
 * Collection.create({
 *   name: "Account",
 *   indexes: {
 *     byUserId: {
 *       terms: [
 *         { field: "userId" }
 *       ]
 *     },
 *     byProviderAndProviderAccountId: {
 *       terms [
 *         { field: "provider" },
 *         { field: "providerAccountId" }
 *       ]
 *     },
 *   }
 * })
 * Collection.create({
 *   name: "Session",
 *   constraints: [
 *     {
 *       unique: ["sessionToken"],
 *       status: "active",
 *     }
 *   ],
 *   indexes: {
 *     bySessionToken: {
 *       terms: [
 *         { field: "sessionToken" }
 *       ]
 *     },
 *     byUserId: {
 *       terms [
 *         { field: "userId" }
 *       ]
 *     },
 *   }
 * })
 * Collection.create({
 *   name: "User",
 *   constraints: [
 *     {
 *       unique: ["email"],
 *       status: "active",
 *     }
 *   ],
 *   indexes: {
 *     byEmail: {
 *       terms [
 *         { field: "email" }
 *       ]
 *     },
 *   }
 * })
 * Collection.create({
 *   name: "VerificationToken",
 *   indexes: {
 *     byIdentifierAndToken: {
 *       terms [
 *         { field: "identifier" },
 *         { field: "token" }
 *       ]
 *     },
 *   }
 * })
 * ```
 *
 * > This schema is adapted for use in Fauna and based upon our main [schema](https://authjs.dev/reference/core/adapters#models)
 *
 * #### Custom collection names
 * If you want to use custom collection names, you can pass them as an option to the adapter, like this:
 *
 * ```javascript
 * FaunaAdapter(client, {
 *   collectionNames: {
 *     user: "CustomUser",
 *     account: "CustomAccount",
 *     session: "CustomSession",
 *     verificationToken: "CustomVerificationToken",
 *   }
 * })
 * ```
 *
 * Make sure the collection names you pass to the provider match the collection names of your Fauna database.
 *
 * ### Migrating from v1
 * In v2, we've renamed the collections to use uppercase naming, in accordance with Fauna best practices. If you're migrating from v1, you'll need to rename your collections to match the new naming scheme.
 * Additionally, we've renamed the indexes to match the new method-like index names.
 *
 * #### Migration script
 * Run this FQL script inside a Fauna shell for the database you're migrating from v1 to v2 (it will rename your collections and indexes to match):
 *
 * ```javascript
 * Collection.byName("accounts")!.update({
 *   name: "Account"
 *   indexes: {
 *     byUserId: {
 *         terms: [{ field: "userId" }]
 *     },
 *     byProviderAndProviderAccountId: {
 *         terms: [{ field: "provider" }, { field: "providerAccountId" }]
 *     },
 *     account_by_provider_and_provider_account_id: null,
 *     accounts_by_user_id: null
 *   }
 * })
 * Collection.byName("sessions")!.update({
 *   name: "Session",
 *   indexes: {
 *     bySessionToken: {
 *         terms: [{ field: "sessionToken" }]
 *     },
 *     byUserId: {
 *         terms: [{ field: "userId" }]
 *     },
 *     session_by_session_token: null,
 *     sessions_by_user_id: null
 *   }
 * })
 * Collection.byName("users")!.update({
 *   name: "User",
 *   indexes: {
 *     byEmail: {
 *         terms: [{ field: "email" }]
 *     },
 *     user_by_email: null
 *   }
 * })
 * Collection.byName("verification_tokens")!.update({
 *   name: "VerificationToken",
 *   indexes: {
 *     byIdentifierAndToken: {
 *         terms: [{ field: "identifier" }, { field: "token" }]
 *     },
 *     verification_token_by_identifier_and_token: null
 *   }
 * })
 * ```
 *
 **/
export function FaunaAdapter(client: Client, config?: AdapterConfig): Adapter {
  const { collectionNames = defaultCollectionNames } = config || {}

  return {
    async createUser(user) {
      const response = await client.query<FaunaUser>(
        fql`Collection(${collectionNames.user}).create(${format.to(user)})`,
      )
      return format.from(response.data)
    },
    async getUser(id) {
      const response = await client.query<FaunaUser | NullDocument>(
        fql`Collection(${collectionNames.user}).byId(${id})`,
      )
      if (response.data instanceof NullDocument) return null
      return format.from(response.data)
    },
    async getUserByEmail(email) {
      const response = await client.query<FaunaUser>(
        fql`Collection(${collectionNames.user}).byEmail(${email}).first()`,
      )
      if (response.data === null) return null
      return format.from(response.data)
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const response = await client.query<FaunaUser>(fql`
        let account = Collection(${collectionNames.account}).byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first()
        if (account != null) {
          Collection(${collectionNames.user}).byId(account.userId)
        } else {
          null
        }
      `)
      return format.from(response.data)
    },
    async updateUser(user) {
      const _user: Partial<AdapterUser> = { ...user }
      delete _user.id
      const response = await client.query<FaunaUser>(
        fql`Collection(${collectionNames.user}).byId(${user.id}).update(${format.to(_user)})`,
      )
      return format.from(response.data)
    },
    async deleteUser(userId) {
      await client.query(fql`
        // Delete the user's sessions
        Collection(${collectionNames.session}).byUserId(${userId}).forEach(session => session.delete())
        
        // Delete the user's accounts
        Collection(${collectionNames.account}).byUserId(${userId}).forEach(account => account.delete())
        
        // Delete the user
        Collection(${collectionNames.user}).byId(${userId}).delete()
      `)
    },
    async linkAccount(account) {
      await client.query<FaunaAccount>(
        fql`Collection(${collectionNames.account}).create(${format.to(account)})`,
      )
      return account
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const response = await client.query<FaunaAccount>(
        fql`Collection(${collectionNames.account}).byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first().delete()`,
      )
      return format.from<AdapterAccount>(response.data)
    },
    async getSessionAndUser(sessionToken) {
      const response = await client.query<[FaunaUser, FaunaSession]>(fql`
        let session = Collection(${collectionNames.session}).bySessionToken(${sessionToken}).first()
        if (session != null) {
          let user = Collection(${collectionNames.user}).byId(session.userId)
          if (user != null) {
            [user, session]
          } else {
            null
          }
        } else {
          null
        }
      `)
      if (response.data === null) return null
      const [user, session] = response.data ?? []
      return { session: format.from(session), user: format.from(user) }
    },
    async createSession(session) {
      await client.query<FaunaSession>(
        fql`Collection(${collectionNames.session}).create(${format.to(session)})`,
      )
      return session
    },
    async updateSession(session) {
      const response = await client.query<FaunaSession>(
        fql`Collection(${collectionNames.session}).bySessionToken(${
          session.sessionToken
        }).first().update(${format.to(session)})`
      )
      return format.from(response.data)
    },
    async deleteSession(sessionToken) {
      await client.query(
        fql`Collection(${collectionNames.session}).bySessionToken(${sessionToken}).first().delete()`,
      )
    },
    async createVerificationToken(verificationToken) {
      await client.query<FaunaVerificationToken>(
        fql`Collection(${collectionNames.verificationToken}).create(${format.to(
          verificationToken,
        )})`,
      )
      return verificationToken
    },
    async useVerificationToken({ identifier, token }) {
      const response = await client.query<FaunaVerificationToken>(
        fql`Collection(${collectionNames.verificationToken}).byIdentifierAndToken(${identifier}, ${token}).first()`,
      )
      if (response.data === null) return null
      // Delete the verification token so it can only be used once
      await client.query(
        fql`Collection(${collectionNames.verificationToken}).byId(${response.data.id}).delete()`,
      )
      const _verificationToken: Partial<FaunaVerificationToken> = {
        ...response.data,
      }
      delete _verificationToken.id
      return format.from(_verificationToken)
    },
  }
}

export const format = {
  /** Takes an object that's coming from the database and converts it to plain JavaScript. */
  from<T>(object: Record<string, any> = {}): T {
    if (!object) return null as unknown as T
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (key === "coll" || key === "ts") continue
      else if (value instanceof TimeStub) newObject[key] = value.toDate()
      else newObject[key] = value
    return newObject as T
  },
  /** Takes an object that's coming from Auth.js and prepares it to be written to the database. */
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (value instanceof Date) newObject[key] = TimeStub.fromDate(value)
      else if (typeof value === "string" && !isNaN(Date.parse(value)))
        newObject[key] = TimeStub.from(value)
      else newObject[key] = value ?? null

    return newObject as T
  },
}
