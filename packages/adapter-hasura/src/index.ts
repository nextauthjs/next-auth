/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px"}}>
 *  <p>Official <a href="https://hasura.io/">Hasura</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://hasura.io/">
 *   <img style={{display: "block"}} src="/img/adapters/hasura.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/hasura-adapter
 * ```
 *
 * @module @auth/hasura-adapter
 */

import { isDate, type Adapter } from "@auth/core/adapters"

import {
  client as hasuraClient,
  type HasuraAdapterClient,
} from "./lib/client.js"
import { useFragment } from "./lib/generated/index.js"
import {
  AccountFragmentDoc,
  CreateAccountDocument,
  CreateSessionDocument,
  CreateUserDocument,
  CreateVerificationTokenDocument,
  DeleteAccountDocument,
  DeleteSessionDocument,
  DeleteUserDocument,
  DeleteVerificationTokenDocument,
  GetSessionAndUserDocument,
  GetUserDocument,
  GetUsersDocument,
  SessionFragmentDoc,
  UpdateSessionDocument,
  UpdateUserDocument,
  UserFragmentDoc,
  VerificationTokenFragmentDoc,
} from "./lib/generated/graphql.js"

export function HasuraAdapter(client: HasuraAdapterClient): Adapter {
  const c = hasuraClient(client)

  return {
    async createUser(newUser) {
      const { insert_users_one } = await c.run(CreateUserDocument, {
        data: format.to<any>(newUser),
      })

      return format.from(useFragment(UserFragmentDoc, insert_users_one), true)
    },
    async getUser(id) {
      const { users_by_pk } = await c.run(GetUserDocument, { id })

      return format.from(useFragment(UserFragmentDoc, users_by_pk))
    },
    async getUserByEmail(email) {
      const { users } = await c.run(GetUsersDocument, {
        where: { email: { _eq: email } },
      })

      return format.from(useFragment(UserFragmentDoc, users?.[0]))
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { users } = await c.run(GetUsersDocument, {
        where: {
          accounts: {
            provider: { _eq: provider },
            providerAccountId: { _eq: providerAccountId },
          },
        },
      })

      return format.from(useFragment(UserFragmentDoc, users?.[0]))
    },
    async updateUser({ id, ...data }) {
      const { update_users_by_pk } = await c.run(UpdateUserDocument, {
        id,
        data: format.to<any>(data),
      })

      return format.from(useFragment(UserFragmentDoc, update_users_by_pk), true)
    },
    async deleteUser(id) {
      const { delete_users_by_pk } = await c.run(DeleteUserDocument, { id })

      return format.from<any, true>(
        useFragment(UserFragmentDoc, delete_users_by_pk),
        true
      )
    },
    async createSession(data) {
      const { insert_sessions_one } = await c.run(CreateSessionDocument, {
        data: format.to<any>(data),
      })

      return format.from(
        useFragment(SessionFragmentDoc, insert_sessions_one),
        true
      )
    },
    async getSessionAndUser(sessionToken) {
      const { sessions } = await c.run(GetSessionAndUserDocument, {
        sessionToken,
      })
      const sessionAndUser = sessions?.[0]
      if (!sessionAndUser) return null

      const { user, ...session } = sessionAndUser

      return {
        session: format.from(useFragment(SessionFragmentDoc, session), true),
        user: format.from(useFragment(UserFragmentDoc, user), true),
      }
    },
    async updateSession({ sessionToken, ...data }) {
      const { update_sessions } = await c.run(UpdateSessionDocument, {
        sessionToken,
        data: format.to<any>(data),
      })
      const session = update_sessions?.returning?.[0]

      return format.from(useFragment(SessionFragmentDoc, session))
    },
    async deleteSession(sessionToken) {
      const { delete_sessions } = await c.run(DeleteSessionDocument, {
        sessionToken,
      })
      const session = delete_sessions?.returning?.[0]

      return format.from<any>(useFragment(SessionFragmentDoc, session))
    },
    async linkAccount(data) {
      const { insert_accounts_one } = await c.run(CreateAccountDocument, {
        data,
      })

      return useFragment(AccountFragmentDoc, insert_accounts_one) as any
    },
    async unlinkAccount(params) {
      const { delete_accounts } = await c.run(DeleteAccountDocument, params)
      const account = delete_accounts?.returning[0]

      return useFragment(AccountFragmentDoc, account) as any
    },
    async createVerificationToken(data) {
      const { insert_verification_tokens_one } = await c.run(
        CreateVerificationTokenDocument,
        { data: format.to<any>(data) }
      )

      return format.from(
        useFragment(
          VerificationTokenFragmentDoc,
          insert_verification_tokens_one
        )
      )
    },
    async useVerificationToken(params) {
      const { delete_verification_tokens } = await c.run(
        DeleteVerificationTokenDocument,
        params
      )
      const verificationToken = delete_verification_tokens?.returning?.[0]

      return format.from(
        useFragment(VerificationTokenFragmentDoc, verificationToken)
      )
    },
  }
}

export const format = {
  from<T, B extends boolean = false>(
    object?: Record<string, any> | null | undefined,
    throwIfNullish?: B
  ): B extends true ? T : T | null {
    if (!object) {
      if (throwIfNullish) throw new Error("Object is nullish")
      return null as any
    }

    const newObject: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(object))
      newObject[key] = isDate(value) ? new Date(value) : value

    return newObject as T
  },
  to<T>(object: Record<string, any>): T {
    const newObject: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(object))
      newObject[key] = value instanceof Date ? value.toISOString() : value

    return newObject as T
  },
}
