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
import { Adapter } from "@auth/core/adapters"
import { Client, fql } from "fauna"
import { FaunaAccount, FaunaUser, FaunaVerificationToken } from "./types"
import { FaunaSession } from "./types"
import { objectToQueryValue } from "./objectToQueryValue"

const userFields = fql`
email,
name,
image,
id: .data.id,
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
      const response = await client.query<FaunaUser>(fql`User.createData(${objectToQueryValue(user)}) { ${userFields} }`)
      return {
        ...response.data,
        emailVerified: response.data.emailVerified.toDate(),
      }
    },
    async getUser(id) {
      const response = await client.query<FaunaUser>(fql`User.byUserId(${id}).first() { ${userFields} }`)
      if (response.data === null) return null
      return {
        ...response.data,
        emailVerified: response.data.emailVerified.toDate(),
      }
    },
    async getUserByEmail(email) {
      const response = await client.query<FaunaUser>(fql`User.byEmail(${email}).first() { ${userFields} }`)
      if (response.data === null) return null
      return {
        ...response.data,
        emailVerified: response.data.emailVerified.toDate(),
      }
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
      if (response.data === null) return null
      return {
        ...response.data,
        emailVerified: response.data.emailVerified.toDate(),
      }
    },
    async updateUser(user) {
      const response = await client.query<FaunaUser>(fql`User.byUserId(${user.id}).first().updateData(${objectToQueryValue(user)}) { ${userFields} }`)
      return {
        ...response.data,
        emailVerified: response.data.emailVerified.toDate(),
      }
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
      await client.query<FaunaAccount>(fql`Account.create(${objectToQueryValue(account)})`)
    },
    async unlinkAccount({ provider, providerAccountId }) {
      await client.query<FaunaAccount>(fql`Account.byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first().delete()`)
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
      if (response.data === null) return null
      const [user, session] = response.data
      return {
        session: {
          ...session,
          expires: session.expires.toDate(),
        },
        user: {
          ...user,
          emailVerified: user.emailVerified.toDate(),
        },
      }
    },
    async createSession(session) {
      const response = await client.query<FaunaSession>(fql`Session.create(${objectToQueryValue(session)}) { ${sessionFields} }`)
      return {
        ...response.data,
        expires: response.data.expires.toDate(),
      }
    },
    async updateSession(session) {
      const response = await client.query<FaunaSession>(fql`Session.bySessionToken(${session.sessionToken}).first().update(${objectToQueryValue(session)}) { ${sessionFields} }`)
      return {
        ...response.data,
        expires: response.data.expires.toDate(),
      }
    },
    async deleteSession(sessionToken) {
      await client.query(fql`Session.bySessionToken(${sessionToken}).first().delete()`)
    },
    async createVerificationToken(verificationToken) {
      const response = await client.query<FaunaVerificationToken>(fql`VerificationToken.create(${objectToQueryValue(verificationToken)}) { ${verificationTokenFields} }`)
      return {
        ...response.data,
        expires: response.data.expires.toDate(),
      }
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
      if (response.data === null) return null
      return {
        ...response.data,
        expires: response.data.expires.toDate(),
      }
    },
  }
}
