/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
 * ```bash npm2yarn2pnpm
 * npm install next-auth @next-auth/fauna-adapter faunadb
 * ```
 *
 * @module @next-auth/fauna-adapter
 */
import {
  Client as FaunaClient,
  ExprArg,
  Collection,
  Create,
  Delete,
  Exists,
  Get,
  If,
  Index,
  Let,
  Match,
  Ref,
  Select,
  Time,
  Update,
  Var,
  Paginate,
  Lambda,
  Do,
  Foreach,
  errors,
} from "faunadb"

import {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters"

export const collections = {
  Users: Collection("users"),
  Accounts: Collection("accounts"),
  Sessions: Collection("sessions"),
  VerificationTokens: Collection("verification_tokens"),
} as const

export const indexes = {
  AccountByProviderAndProviderAccountId: Index(
    "account_by_provider_and_provider_account_id"
  ),
  UserByEmail: Index("user_by_email"),
  SessionByToken: Index("session_by_session_token"),
  VerificationTokenByIdentifierAndToken: Index(
    "verification_token_by_identifier_and_token"
  ),
  SessionsByUser: Index("sessions_by_user_id"),
  AccountsByUser: Index("accounts_by_user_id"),
} as const

export const format = {
  /** Takes a plain old JavaScript object and turns it into a Fauna object */
  to(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (value instanceof Date) {
        newObject[key] = Time(value.toISOString())
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
      if (value?.value && typeof value.value === "string") {
        newObject[key] = new Date(value.value)
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
  return async function <T>(expr: ExprArg): Promise<T | null> {
    try {
      const result = await f.query<{
        data: T
        ref: { id: string }
      } | null>(expr)
      if (!result) return null
      return format({ ...result.data, id: result.ref.id })
    } catch (error) {
      if ((error as errors.FaunaError).name === "NotFound") return null
      if (
        (error as errors.FaunaError).description?.includes(
          "Number or numeric String expected"
        )
      )
        return null

      if (process.env.NODE_ENV === "test") console.error(error)

      throw error
    }
  }
}

/**
 *
 * ## Basic usage
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
 * import { FaunaAdapter } from "@next-auth/fauna-adapter"
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
 * > This schema is adapted for use in Fauna and based upon our main [schema](/reference/adapters/models)
 **/
export function FaunaAdapter(f: FaunaClient): Adapter {
  const { Users, Accounts, Sessions, VerificationTokens } = collections
  const {
    AccountByProviderAndProviderAccountId,
    AccountsByUser,
    SessionByToken,
    SessionsByUser,
    UserByEmail,
    VerificationTokenByIdentifierAndToken,
  } = indexes
  const { to, from } = format
  const q = query(f, from)
  return {
    createUser: async (data) => (await q(Create(Users, { data: to(data) })))!,
    getUser: async (id) => await q(Get(Ref(Users, id))),
    getUserByEmail: async (email) => await q(Get(Match(UserByEmail, email))),
    async getUserByAccount({ provider, providerAccountId }) {
      const key = [provider, providerAccountId]
      const ref = Match(AccountByProviderAndProviderAccountId, key)
      const user = await q<AdapterUser>(
        Let(
          { ref },
          If(
            Exists(Var("ref")),
            Get(Ref(Users, Select(["data", "userId"], Get(Var("ref"))))),
            null
          )
        )
      )
      return user
    },
    updateUser: async (data) =>
      (await q(Update(Ref(Users, data.id), { data: to(data) })))!,
    async deleteUser(userId) {
      await f.query(
        Do(
          Foreach(
            Paginate(Match(SessionsByUser, userId)),
            Lambda("ref", Delete(Var("ref")))
          ),
          Foreach(
            Paginate(Match(AccountsByUser, userId)),
            Lambda("ref", Delete(Var("ref")))
          ),
          Delete(Ref(Users, userId))
        )
      )
    },
    linkAccount: async (data) =>
      (await q(Create(Accounts, { data: to(data) })))!,
    async unlinkAccount({ provider, providerAccountId }) {
      const id = [provider, providerAccountId]
      await q(
        Delete(
          Select("ref", Get(Match(AccountByProviderAndProviderAccountId, id)))
        )
      )
    },
    createSession: async (data) =>
      (await q<AdapterSession>(Create(Sessions, { data: to(data) })))!,
    async getSessionAndUser(sessionToken) {
      const session = await q<AdapterSession>(
        Get(Match(SessionByToken, sessionToken))
      )
      if (!session) return null

      const user = await q<AdapterUser>(Get(Ref(Users, session.userId)))

      return { session, user: user! }
    },
    async updateSession(data) {
      const ref = Select("ref", Get(Match(SessionByToken, data.sessionToken)))
      return await q(Update(ref, { data: to(data) }))
    },
    async deleteSession(sessionToken) {
      await q(Delete(Select("ref", Get(Match(SessionByToken, sessionToken)))))
    },
    async createVerificationToken(data) {
      // @ts-expect-error
      const { id: _id, ...verificationToken } = await q<VerificationToken>(
        Create(VerificationTokens, { data: to(data) })
      )
      return verificationToken
    },
    async useVerificationToken({ identifier, token }) {
      const key = [identifier, token]
      const object = Get(Match(VerificationTokenByIdentifierAndToken, key))

      const verificationToken = await q<VerificationToken>(object)
      if (!verificationToken) return null

      // Verification tokens can be used only once
      await q(Delete(Select("ref", object)))

      // @ts-expect-error
      delete verificationToken.id
      return verificationToken
    },
  }
}
