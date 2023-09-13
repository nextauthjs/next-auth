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
 * ```bash npm2yarn2pnpm
 * npm install next-auth @auth/hasura-adapter graphql graphql-request
 * ```
 *
 * @module @auth/hasura-adapter
 */

import { GraphQLClient } from "graphql-request"
import type { Adapter } from "@auth/core/adapters"
import { useFragment } from "./gql"
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
} from "./gql/graphql"

import { nullsToUndefined, transformDate } from "./utils"

interface HasuraAdapterArgs {
  endpoint: string
  adminSecret: string
  graphqlRequestOptions?: any
}

/**
 *
 * ## Setup
 *
 * 1. Create the next-auth schema in your database using SQL.
 *
 *   ```sql
 *   CREATE TABLE accounts (
 *       id uuid DEFAULT gen_random_uuid() NOT NULL,
 *       type text NOT NULL,
 *       provider text NOT NULL,
 *       "providerAccountId" text NOT NULL,
 *       refresh_token text,
 *       access_token text,
 *       expires_at bigint,
 *       token_type text,
 *       scope text,
 *       id_token text,
 *       session_state text,
 *       oauth_token_secret text,
 *       oauth_token text,
 *       "userId" uuid NOT NULL,
 *       refresh_token_expires_in bigint
 *   );
 *
 *   CREATE TABLE sessions (
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
 *   INSERT INTO provider_type (value) VALUES ('credentials'), ('email'), ('oauth');
 *
 *   ALTER TABLE ONLY accounts
 *       ADD CONSTRAINT "accounts_type_fkey" FOREIGN KEY ("type") REFERENCES public.provider_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;
 *   ```
 *
 *1. [Track all the tables and relationships in Hasura](https://hasura.io/docs/latest/schema/postgres/using-existing-database/#step-1-track-tablesviews)
 *
 *1. Install the necessary packages
 *
 *   ```bash npm2yarn2pnpm
 *   npm install next-auth @next-auth/hasura-adapter graphql graphql-request
 *   ```
 *
 *1. Configure your NextAuth.js to use the Hasura Adapter:
 *
 *   ```javascript title="pages/api/auth/[...nextauth].js"
 *   import NextAuth from "next-auth"
 *   import { HasuraAdapter } from "@next-auth/hasura-adapter"
 *
 *   // For more information on each option (and a full list of options) go to
 *   // https://next-auth.js.org/configuration/options
 *   export default nextAuth({
 *   adapter: HasuraAdapter({
 *       endpoint: "<Hasura-GraphQL-endpoint>",
 *       adminSecret: "<admin-secret>",
 *       graphqlRequestOptions: {
 *       // Optional graphql-request options
 *       },
 *   }),
 *   ...
 *   })
 *   ```
 *
 *## Passing dynamic headers
 *
 *If you use [graphql-request's dynamic headers feature](https://github.com/prisma-labs/graphql-request#passing-dynamic-headers-to-the-client), you are responsible for passing the 'X-Hasura-Admin-Secret' header
 *
 *```js
 *export default nextAuth({
 *  adapter: HasuraAdapter({
 *    endpoint: "<Hasura-GraphQL-endpoint>",
 *    adminSecret: "<admin-secret>",
 *    graphqlRequestOptions: {
 *      headers: () => ({
 *        "X-Hasura-Admin-Secret": "<admin-secret>",
 *        // your headers here
 *      }),
 *    },
 *  }),
 *  ...
 *})
 *```

 */
export const HasuraAdapter = ({
  endpoint,
  adminSecret,
  graphqlRequestOptions,
}: HasuraAdapterArgs): Adapter => {
  const client = new GraphQLClient(endpoint, {
    fetch: fetch ?? undefined,
    ...graphqlRequestOptions,
    headers:
      graphqlRequestOptions?.headers instanceof Function
        ? graphqlRequestOptions?.headers
        : {
            ...graphqlRequestOptions?.headers,
            "x-hasura-admin-secret": adminSecret,
          },
  })

  return {
    // User
    createUser: async (data) => {
      const { insert_users_one } = await client.request(CreateUserDocument, {
        data,
      })
      const user = useFragment(UserFragmentDoc, insert_users_one)

      if (!user) {
        throw new Error("Error creating user")
      }

      return transformDate(user, "emailVerified")
    },
    getUser: async (id) => {
      const { users_by_pk } = await client.request(GetUserDocument, { id })
      const user = useFragment(UserFragmentDoc, users_by_pk)

      return user ? transformDate(user, "emailVerified") : null
    },
    getUserByEmail: async (email) => {
      const { users } = await client.request(GetUsersDocument, {
        where: { email: { _eq: email } },
      })
      const user = useFragment(UserFragmentDoc, users?.[0])

      if (!user) return null

      return user ? transformDate(user, "emailVerified") : null
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      const { users } = await client.request(GetUsersDocument, {
        where: {
          accounts: {
            provider: { _eq: provider },
            providerAccountId: { _eq: providerAccountId },
          },
        },
      })
      const user = useFragment(UserFragmentDoc, users?.[0])

      if (!user) return null

      return user ? transformDate(user, "emailVerified") : null
    },
    updateUser: async ({ id, ...data }) => {
      const { update_users_by_pk } = await client.request(UpdateUserDocument, {
        id,
        data,
      })
      const user = useFragment(UserFragmentDoc, update_users_by_pk)

      if (!user) {
        throw new Error("Error updating user")
      }

      return transformDate(user, "emailVerified")
    },
    deleteUser: async (id) => {
      const { delete_users_by_pk } = await client.request(DeleteUserDocument, {
        id,
      })
      const user = useFragment(UserFragmentDoc, delete_users_by_pk)

      if (!user) {
        throw new Error("Error deleting user")
      }

      return transformDate(user, "emailVerified")
    },
    // Session
    createSession: async (data) => {
      const { insert_sessions_one } = await client.request(
        CreateSessionDocument,
        { data }
      )
      const session = useFragment(SessionFragmentDoc, insert_sessions_one)

      if (!session) {
        throw new Error("Error creating session")
      }

      return transformDate(session, "expires")
    },
    getSessionAndUser: async (sessionToken) => {
      const { sessions } = await client.request(GetSessionAndUserDocument, {
        sessionToken,
      })
      const session = sessions?.[0]

      if (!session) {
        return null
      }

      const { user, ...sessionData } = session

      return {
        session: transformDate(
          useFragment(SessionFragmentDoc, sessionData),
          "expires"
        ),
        user: transformDate(
          useFragment(UserFragmentDoc, user),
          "emailVerified"
        ),
      }
    },
    updateSession: async ({ sessionToken, ...data }) => {
      const { update_sessions } = await client.request(UpdateSessionDocument, {
        sessionToken,
        data,
      })
      const session = update_sessions?.returning?.[0]

      if (!session) {
        return null
      }

      return transformDate(useFragment(SessionFragmentDoc, session), "expires")
    },
    deleteSession: async (sessionToken) => {
      const { delete_sessions } = await client.request(DeleteSessionDocument, {
        sessionToken,
      })
      const session = delete_sessions?.returning?.[0]

      if (!session) {
        return null
      }

      return transformDate(useFragment(SessionFragmentDoc, session), "expires")
    },
    // Account
    linkAccount: async (data) => {
      const { insert_accounts_one } = await client.request(
        CreateAccountDocument,
        { data }
      )

      if (!insert_accounts_one) {
        return null
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return nullsToUndefined(
        useFragment(AccountFragmentDoc, insert_accounts_one)
      )
    },
    unlinkAccount: async ({ providerAccountId, provider }) => {
      const { delete_accounts } = await client.request(DeleteAccountDocument, {
        provider,
        providerAccountId,
      })
      const account = delete_accounts?.returning[0]

      if (!account) {
        return undefined
      }

      // eslint-disable-next-line @typescript-eslint/return-await
      return nullsToUndefined(useFragment(AccountFragmentDoc, account))
    },
    // Verification Token
    createVerificationToken: async (data) => {
      const { insert_verification_tokens_one } = await client.request(
        CreateVerificationTokenDocument,
        { data }
      )

      if (!insert_verification_tokens_one) {
        return null
      }

      return transformDate(
        useFragment(
          VerificationTokenFragmentDoc,
          insert_verification_tokens_one
        ),
        "expires"
      )
    },
    useVerificationToken: async ({ identifier, token }) => {
      const { delete_verification_tokens } = await client.request(
        DeleteVerificationTokenDocument,
        { identifier, token }
      )
      const verificationToken = delete_verification_tokens?.returning?.[0]

      if (!verificationToken) {
        return null
      }

      return transformDate(
        useFragment(VerificationTokenFragmentDoc, verificationToken),
        "expires"
      )
    },
  }
}
