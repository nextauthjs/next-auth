/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://docs.fauna.com/fauna/current/">Fauna v10</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://fauna.com/features">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/fauna.svg" height="30"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/faunadb-adapter fauna
 * ```
 *
 * @module @auth/faunadb-adapter
 */
import {
  Client as FaunaClient,
  Query,
  QuerySuccess,
  QueryValue,
  QueryValueObject,
  fql,
} from "fauna"

import {
  Adapter,
  AdapterSession,
  AdapterUser,
  AdapterAccount,
  VerificationToken,
} from "@auth/core/adapters"

export function FaunaAdapter(f: FaunaClient): Adapter {
  const { to, from } = format
  const q = query(f, from)
  const createUserQuery = fql`Users.create({ to(data) })`

  return {
    createUser: async (data) => await q(fql`Users.create({ ${to(data)} })`),
    getUser: async (id) => await q(fql`Users.byId(${id})`),
    getUserByEmail: async (email) =>
      await q(fql`Users.byEmail(.email == ${email})`),
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const key = [provider, providerAccountId]
      const accountQuery = fql`Accounts.byProviderAndProviderAccountId(${key})`
      const accountResult: QuerySuccess<AdapterAccount> = await q(accountQuery)
      if (!accountResult) return null
      const userQuery = fql`Users.byId(${accountResult.data.userId})`
      const userResult: QuerySuccess<AdapterUser> = await q(userQuery)
      return userResult.data
    },
    updateUser: async (data) =>
      await q(fql`Users.byId(data.id)!.update({ ${to(data)} })`),
    deleteUser: async (userId) => {
      await q(fql`Sessions.byUserId(${userId})!.forEach(.delete())`)
      await q(fql`Accounts.byUserId(${userId})!.forEach(.delete())`)
      await q(fql`Users.byId(${userId})!.delete()`)
      return null
    },
    linkAccount: async (data) => await q(fql`Accounts.create(${to(data)})!`),
    unlinkAccount: async ({ provider, providerAccountId }) => {
      const id = [provider, providerAccountId]
      return await q(
        fql`Accounts.byProviderAndProviderAccountId(${id}).delete()`
      )
    },
    createSession: async (data) => await q(fql`Sessions.create(${to(data)})`),
    getSessionAndUser: async (sessionToken) => {
      const session = await q(
        fql`Sessions.bySessionToken(${sessionToken})!.first()`
      )
      if (!session) return null
      const user = await q(fql`Users.byId(${session.userId})!`)
      return { session: session, user: user! }
    },
    updateSession: async (data) =>
      await q(
        fql`Session.bySessionToken(${data.sessionToken}).update(${to(data)})`
      ),
    deleteSession: async (sessionToken) =>
      await q(fql`Session.bySessionToken(${sessionToken}).delete()`),
    createVerificationToken: async (data) => {
      const { id: _id, ...verificationToken } = await q(
        fql`VerificationTokens.create(${to(data)})`
      )
      return verificationToken
    },
    useVerificationToken: async ({ identifier, token }) => {
      const key = [identifier, token]
      const object = fql`VerificationTokens.byIdentifierAndToken(${key})`
      const verificationToken = await q(object)
      if (!verificationToken) return null
      await q(fql`VerificationTokens.byId(${verificationToken.id}).delete()`)
      delete verificationToken.id
      return verificationToken
    },
  }
}

export const format = {
  /** Takes a plain old JavaScript object and turns it into a Fauna object */
  to(object: Record<string, any>) {
    const newObject: QueryValue = {}
    for (const key in object) {
      const value = object[key]
      if (value instanceof Date) {
        newObject[key] = value.toISOString()
      } else {
        newObject[key] = value
      }
    }
    return newObject
  },
  /** Takes a Fauna object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (key === "expires" && typeof value === "string") {
        newObject[key] = new Date(value)
      } else {
        newObject[key] = value
      }
    }
    return newObject as T
  },
}

/**
 * Fauna throws an error when something is not found in the db,
 * `next-auth` expects `null` to be returned
 */
export function query(f: FaunaClient, format: (...args: any) => any) {
  return async function <T>(expr: Query): Promise<any | null> {
    try {
      const result: QuerySuccess<QueryValue> = await f.query(expr)
      if (!result) return null
      const finalResult = result.data ? format(result.data) : format(result)
      return finalResult
    } catch (error) {
      if ((error as errors.FaunaError).name === "NotFound") return null
      if (
        (error as errors.FaunaError).description?.includes(
          "Number or numeric String expected"
        )
      )
        return null
    }
  }
}
//   return async function <T>(expr: QueryValue): Promise<any | null> {
//     try {
//       const result = await f.query<QueryValue>(expr)
//       if (!result) return null
//       return format({ ...result.data })
//     } catch (error) {
//       if ((error as errors.FaunaError).name === "NotFound") return null
//       if (
//         (error as errors.FaunaError).description?.includes(
//           "Number or numeric String expected"
//         )
//       )
//         return null

//       if (process.env.NODE_ENV === "test") console.error(error)

//       throw error
//     }
//   }
// }

/**
 *
 * ## Setup
 *
 * This is the Fauna Adapter for [`next-auth`](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.
 *
 * You can find the Fauna schema and seed information in the docs at [authjs.dev/reference/adapters/fauna](https://authjs.dev/reference/adapters/fauna).
 *
 * ### Configure Auth.js
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { Client as FaunaClient } from "faunadb"
 * import { FaunaAdapter } from "@auth/fauna-adapter"
 *
 * const client = new FaunaClient({
 *   secret: "secret",
 *   scheme: "http",
 *   domain: "localhost",
 *   port: 8443,
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
 * CreateCollection({ name: "accounts" })
 * CreateCollection({ name: "sessions" })
 * CreateCollection({ name: "users" })
 * CreateCollection({ name: "verification_tokens" })
 * ```
 *
 * ```javascript
 * CreateIndex({
 *   name: "account_by_provider_and_provider_account_id",
 *   source: Collection("accounts"),
 *   unique: true,
 *   terms: [
 *     { field: ["data", "provider"] },
 *     { field: ["data", "providerAccountId"] },
 *   ],
 * })
 * CreateIndex({
 *   name: "session_by_session_token",
 *   source: Collection("sessions"),
 *   unique: true,
 *   terms: [{ field: ["data", "sessionToken"] }],
 * })
 * CreateIndex({
 *   name: "user_by_email",
 *   source: Collection("users"),
 *   unique: true,
 *   terms: [{ field: ["data", "email"] }],
 * })
 * CreateIndex({
 *   name: "verification_token_by_identifier_and_token",
 *   source: Collection("verification_tokens"),
 *   unique: true,
 *   terms: [{ field: ["data", "identifier"] }, { field: ["data", "token"] }],
 * })
 * ```
 *
 * > This schema is adapted for use in Fauna and based upon our main [schema](https://authjs.dev/reference/adapters#models)
 **/
