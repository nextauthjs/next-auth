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
 * npm install @auth/fauna-adapter fauna
 * ```
 *
 * @module @auth/fauna-adapter
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
      // email has a unique constraint in Fauna so it's safe to assume there's only one.
      await q(fql`Users.byEmail(${email}).first()`),
    getUserByAccount: async ({ provider, providerAccountId }) => {
      const accountQuery = fql`Accounts.byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first()`
      const accountResult: AdapterAccount = await q(accountQuery)
      if (!accountResult) return null

      const userQuery = fql`Users.byId(${accountResult.userId})`
      const userResult: AdapterUser = await q(userQuery)
      return userResult
    },
    updateUser: async (data) =>
      await q(fql`Users.byId(${data.id})!.update({ ${to(data)} })`),
    deleteUser: async (userId) => {
      await q(fql`Sessions.byUserId(${userId})!.forEach(.delete())`)
      await q(fql`Accounts.byUserId(${userId})!.forEach(.delete())`)
      await q(fql`Users.byId(${userId})!.delete()`)
      return null
    },
    linkAccount: async (data) => await q(fql`Accounts.create(${to(data)})!`),
    unlinkAccount: async ({ provider, providerAccountId }) =>
      await q(
        fql`Accounts.byProviderAndProviderAccountId(${provider}, ${providerAccountId}).first().delete()`
      ),
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
        fql`Sessions.bySessionToken(${data.sessionToken}).update(${to(data)})`
      ),
    deleteSession: async (sessionToken) =>
      await q(fql`Sessions.bySessionToken(${sessionToken}).forEach(.delete())`),
    createVerificationToken: async (data) => {
      const { id: _id, ...verificationToken } = await q(
        fql`VerificationTokens.create(${to(data)})`
      )
      return verificationToken
    },
    useVerificationToken: async ({ identifier, token }) => {
      const object = fql`VerificationTokens.byIdentifierAndToken(${identifier}, ${token})`
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
      // If the query returns a null result, it might be hidden inside a .data key.
      if (Object.keys(result).includes("data") && !result.data) return null
      console.log(result)
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

/**
 *
 * ## Setup
 *
 * This is the Fauna v10 Adapter for [`next-auth`](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.
 *
 * You can find the Fauna schema and seed information in the docs at [authjs.dev/reference/adapters/fauna](https://authjs.dev/reference/adapter/fauna).
 *
 * ### Configure Auth.js
 *
 * ```javascript title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { Client as FaunaClient } from "fauna"
 * import { FaunaAdapter } from "@auth/fauna-adapter"
 *
 * const client = new FaunaClient({
 *   secret: "secret",
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
 * Collection.create({ name: "accounts" })
 * Collection.create({ name: "sessions" })
 * Collection.create({ name: "users" })
 * Collection.create({ name: "verification_tokens" })
 * ```
 *
 * ```javascript
 * Accounts.definition.update({
 *    indexes: {
 *      byUserId: {
 *        terms: [{ field: "userId" }],
 *      },
 *      byProviderAndProviderAccountId: {
 *        terms: [
 *          { field: "provider" },
 *          { field: "providerAccountId" }
 *        ]
 *      }
 *    },
 *    constraints: [{
 *      unique: ["provider", "providerAccountId"]
 *    }]
 *  })
 *
 *  Sessions.definition.update({
 *    indexes: {
 *      bySessionToken: {
 *        terms: [{ field: "sessionToken" }],
 *      },
 *      byUserId: {
 *        terms: [{ field: "userId" }]
 *      }
 *    },
 *    constraints: [{
 *      unique: ["sessionToken"]
 *    }]
 *  })
 *
 *  Users.definition.update({
 *    indexes: {
 *      byEmail: {
 *        terms: [{ field: "email"}]
 *      }
 *    }
 *  })
 *
 *  VerificationTokens.definition.update({
 *    indexes: {
 *      byIdentifierAndToken: {
 *        terms: [
 *          { field: "identifier" },
 *          { field: "token" },
 *        ],
 *      }
 *    },
 *    constraints: [{
 *      unique: ["identifier", "token"]
 *    }]
 *  })
 * ```
 *
 * > This schema is adapted for use in Fauna v10 and based upon our main [schema](https://authjs.dev/reference/adapters#models)
 **/
