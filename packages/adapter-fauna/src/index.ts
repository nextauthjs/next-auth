/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://docs.fauna.com/fauna/current/">Fauna</a> adapter for Auth.js / NextAuth.js.</p>
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
import { Client, TimeStub, fql } from "fauna"

import type {
  Adapter,
  AdapterUser,
  AdapterSession,
  VerificationToken,
  AdapterAccount,
} from "@auth/core/adapters"

type ToFauna<T> = {
  [P in keyof T]: T[P] extends Date | null ? TimeStub | null : T[P]
}

export type FaunaUser = ToFauna<AdapterUser>
export type FaunaSession = ToFauna<AdapterSession>
export type FaunaVerificationToken = ToFauna<VerificationToken>
export type FaunaAccount = ToFauna<AdapterAccount> & any // TODO: Remove `& any`

export const userFields = fql`
email,
name,
image,
id,
emailVerified
`

export const sessionFields = fql`
sessionToken,
userId,
expires
`

export const verificationTokenFields = fql`
identifier,
expires,
token
`

/**
 *
 * ## Setup
 *
 * This is the Fauna Adapter for [`next-auth`](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.
 *
 * You can find the Fauna schema and seed information in the docs at [authjs.dev/reference/adapter/fauna](https://authjs.dev/reference/adapter/fauna).
 *
 * ### Configure Auth.js
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
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
 *   ...
 * })
 * ```
 *
 * ### Schema
 *
 * Run the following commands inside of the `Shell` tab in the Fauna dashboard to setup the appropriate collections and indexes.
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
 *     },
 *     {
 *       unique: ["data.id"],
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
 * ### Migrating from v1
 * In v2, we've renamed the collections to use uppercase naming, in accordance with Fauna best practices. If you're migrating from v1, you'll need to rename your collections to match the new naming scheme.
 * Additionally, we've renamed the indexes to match the new method-like index names. Please see above for the new index definitions.
 *
 **/
export function FaunaAdapter(client: Client): Adapter {
  return {
    async createUser(user) {
      await client.query(
        fql`User.createData(${format.to(user)}) { ${userFields} }`
      )
      return user
    },
    async getUser(id) {
      const response = await client.query<FaunaUser>(
        fql`User.byUserId(${id}).first() { ${userFields} }`
      )
      return format.from(response.data)
    },
    async getUserByEmail(email) {
      const response = await client.query<FaunaUser>(
        fql`User.byEmail(${email}).first() { ${userFields} }`
      )
      return format.from(response.data)
    },
    async getUserByAccount({ provider, providerAccountId }) {
      const response = await client.query<FaunaUser>(fql`
        let account = Account.byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first()
        if (account != null) {
          User.byUserId(account.userId).first() { ${userFields} }
        } else {
          null
        }
      `)
      return format.from(response.data)
    },
    async updateUser(user) {
      const response = await client.query<FaunaUser>(
        fql`User.byUserId(${user.id}).first().updateData(${format.to(
          user
        )}) { ${userFields} }`
      )
      return format.from(response.data)
    },
    async deleteUser(userId) {
      await client.query(fql`
        // Delete the user's sessions
        Session.byUserId(${userId}).forEach(session => session.delete())
        
        // Delete the user's accounts
        Account.byUserId(${userId}).forEach(account => account.delete())
        
        // Delete the user
        User.byUserId(${userId}).first().delete()
      `)
    },
    async linkAccount(account) {
      await client.query<FaunaAccount>(
        fql`Account.create(${format.to(account)})`
      )
      return account
    },
    async unlinkAccount({ provider, providerAccountId }) {
      const response = await client.query<FaunaAccount>(
        fql`Account.byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first().delete()`
      )
      return format.from<AdapterAccount>(response.data)
    },
    async getSessionAndUser(sessionToken) {
      const response = await client.query<[FaunaUser, FaunaSession]>(fql`
        let session = Session.bySessionToken(${sessionToken}).first() { ${sessionFields} }
        if (session != null) {
          let user = User.byUserId(session.userId).first() { ${userFields} }
          if (user != null) {
            [user, session]
          } else {
            null
          }
        } else {
          null
        }
      `)
      const [user, session] = response.data ?? []
      return { session: format.from(session), user: format.from(user) }
    },
    async createSession(session) {
      await client.query<FaunaSession>(
        fql`Session.create(${format.to(session)}) { ${sessionFields} }`
      )
      return session
    },
    async updateSession(session) {
      const response = await client.query<FaunaSession>(
        fql`Session.bySessionToken(${
          session.sessionToken
        }).first().update(${format.to(session)}) { ${sessionFields} }`
      )
      return format.from(response.data)
    },
    async deleteSession(sessionToken) {
      await client.query(
        fql`Session.bySessionToken(${sessionToken}).first().delete()`
      )
    },
    async createVerificationToken(verificationToken) {
      await client.query<FaunaVerificationToken>(
        fql`VerificationToken.create(${format.to(
          verificationToken
        )}) { ${verificationTokenFields} }`
      )
      return verificationToken
    },
    async useVerificationToken({ identifier, token }) {
      const response = await client.query<FaunaVerificationToken>(fql`
        let verificationToken = VerificationToken.byIdentifierAndToken(${identifier}, ${token}).first()
        if (verificationToken != null) {
          let selection = verificationToken { ${verificationTokenFields} }
          
          // Verification tokens can be used only once
          verificationToken.delete()
          
          selection
        } else {
          null
        }
      `)
      return format.from(response.data)
    },
  }
}

export const format = {
  /** Takes an object that's coming from a database and converts it to plain JavaScript. */
  from<T>(object: Record<string, any> = {}): T {
    if (!object) return null as unknown as T
    const newObject: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(object))
      if (value instanceof TimeStub) newObject[key] = value.toDate()
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
