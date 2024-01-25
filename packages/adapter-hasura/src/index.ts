/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://hasura.io/">Hasura</a> adapter for Auth.js / NextAuth.js.</p>
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

import type { Adapter } from "@auth/core/adapters"

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

/**
 *
 * ## Setup
 *
 * 1. Create the Auth.js schema in your database using SQL.
 *
 *   ```sql
 *   CREATE TABLE accounts (
 *       id uuid DEFAULT gen_random_uuid() NOT NULL,
 *       type text NOT NULL,
 *       provider text NOT NULL,
 *       "providerAccountId" text NOT NULL,
 *       refresh_token text,
 *       access_token text,
 *       expires_at integer,
 *       token_type text,
 *       scope text,
 *       id_token text,
 *       session_state text,
 *       "userId" uuid NOT NULL
 *   );
 *
 *   CREATE TABLE sessions (
 *       id uuid DEFAULT gen_random_uuid() NOT NULL,
 *       "sessionToken" text NOT NULL,
 *       "userId" uuid NOT NULL,
 *       expires timestamptz NOT NULL
 *   );
 *
 *   CREATE TABLE users (
 *       id uuid DEFAULT gen_random_uuid() NOT NULL,
 *       name text,
 *       email text NOT NULL,
 *       "emailVerified" timestamptz,
 *       image text
 *   );
 *
 *   CREATE TABLE verification_tokens (
 *       token text NOT NULL,
 *       identifier text NOT NULL,
 *       expires timestamptz NOT NULL
 *   );
 *
 *   CREATE TABLE provider_type (
 *       value text NOT NULL
 *   );
 *
 *   ALTER TABLE ONLY accounts
 *       ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);
 *
 *   ALTER TABLE ONLY sessions
 *       ADD CONSTRAINT sessions_pkey PRIMARY KEY ("sessionToken");
 *
 *   ALTER TABLE ONLY users
 *       ADD CONSTRAINT users_email_key UNIQUE (email);
 *
 *   ALTER TABLE ONLY users
 *       ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 *
 *   ALTER TABLE ONLY verification_tokens
 *       ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (token);
 *
 *   ALTER TABLE ONLY provider_type
 *       ADD CONSTRAINT provider_type_pkey PRIMARY KEY (value);
 *
 *   ALTER TABLE ONLY accounts
 *       ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
 *
 *   ALTER TABLE ONLY sessions
 *       ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;
 *
 *   INSERT INTO provider_type (value) VALUES ('credentials'), ('email'), ('oauth'), ('oidc');
 *
 *   ALTER TABLE ONLY accounts
 *       ADD CONSTRAINT "accounts_type_fkey" FOREIGN KEY ("type") REFERENCES public.provider_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
 *   ```
 *
 * :::info
 * Tips: [Track all the tables and relationships in Hasura](https://hasura.io/docs/latest/schema/postgres/using-existing-database/#step-1-track-tablesviews)
 * :::
 *
 * 2. Add the adapter to your `pages/api/[...nextauth].ts` next-auth configuration object.
 *
 *   ```javascript title="pages/api/auth/[...nextauth].js"
 *   import NextAuth from "next-auth"
 *   import { HasuraAdapter } from "@auth/hasura-adapter"
 *
 *   export default NextAuth({
 *     adapter: HasuraAdapter({
 *       endpoint: "<Hasura-GraphQL-endpoint>",
 *       adminSecret: "<admin-secret>",
 *     }),
 *   ...
 *   })
 *   ```
 */
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

// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
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
