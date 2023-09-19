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
import type { Adapter, AdapterAccount } from "@auth/core/adapters"
import { useFragment } from "./lib"
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
} from "./lib/graphql"
import type {
  AccountFragment,
  CreateAccountMutation,
  CreateAccountMutationVariables,
  CreateSessionMutation,
  CreateSessionMutationVariables,
  CreateUserMutation,
  CreateUserMutationVariables,
  CreateVerificationTokenMutation,
  CreateVerificationTokenMutationVariables,
  DeleteAccountMutation,
  DeleteAccountMutationVariables,
  DeleteSessionMutation,
  DeleteSessionMutationVariables,
  DeleteUserMutation,
  DeleteUserMutationVariables,
  DeleteVerificationTokenMutation,
  DeleteVerificationTokenMutationVariables,
  GetSessionAndUserQuery,
  GetSessionAndUserQueryVariables,
  GetUserQuery,
  GetUserQueryVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
  UpdateSessionMutation,
  UpdateSessionMutationVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from "./lib/graphql"
import { formatDateConversion } from "./utils"
import type { NonNullify } from "./utils"
import { log } from "console"

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
 *       expires_at integer,
 *       token_type text,
 *       scope text,
 *       id_token text,
 *       session_state text,
 *       "userId" uuid NOT NULL,
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
    createUser: async (newUser) => {
      const variables: CreateUserMutationVariables = {
        data: formatDateConversion(newUser, "emailVerified", "toDatabase"),
      }
      const { insert_users_one } = await client.request<CreateUserMutation>(
        CreateUserDocument.toString(),
        variables
      )
      const user = useFragment(UserFragmentDoc, insert_users_one)

      if (!user) {
        throw new Error("Error creating user")
      }
      return formatDateConversion(user, "emailVerified", "toJS")
    },
    getUser: async (id) => {
      const variables: GetUserQueryVariables = { id }
      const { users_by_pk } = await client.request<GetUserQuery>(
        GetUserDocument.toString(),
        variables
      )
      const user = useFragment(UserFragmentDoc, users_by_pk)

      return user ? formatDateConversion(user, "emailVerified", "toJS") : null
    },
    getUserByEmail: async (email) => {
      const variables: GetUsersQueryVariables = {
        where: { email: { _eq: email } },
      }
      const { users } = await client.request<GetUsersQuery>(
        GetUsersDocument.toString(),
        variables
      )

      const user = useFragment(UserFragmentDoc, users?.[0])

      if (!user) return null

      return user ? formatDateConversion(user, "emailVerified", "toJS") : null
    },
    getUserByAccount: async ({ providerAccountId, provider }) => {
      const variables: GetUsersQueryVariables = {
        where: {
          accounts: {
            provider: { _eq: provider },
            providerAccountId: { _eq: providerAccountId },
          },
        },
      }
      const { users } = await client.request<GetUsersQuery>(
        GetUsersDocument.toString(),
        variables
      )
      const user = useFragment(UserFragmentDoc, users?.[0])

      if (!user) return null

      return user ? formatDateConversion(user, "emailVerified", "toJS") : null
    },
    updateUser: async ({ id, ...data }) => {
      const variables: UpdateUserMutationVariables = {
        id,
        data: formatDateConversion(data, "emailVerified", "toDatabase"),
      }
      const { update_users_by_pk } = await client.request<UpdateUserMutation>(
        UpdateUserDocument.toString(),
        variables
      )
      const user = useFragment(UserFragmentDoc, update_users_by_pk)

      if (!user) {
        throw new Error("Error updating user")
      }

      return formatDateConversion(user, "emailVerified", "toJS")
    },
    deleteUser: async (id) => {
      const variables: DeleteUserMutationVariables = {
        id,
      }
      const { delete_users_by_pk } = await client.request<DeleteUserMutation>(
        DeleteUserDocument.toString(),
        variables
      )
      const user = useFragment(UserFragmentDoc, delete_users_by_pk)

      if (!user) {
        throw new Error("Error deleting user")
      }
      return formatDateConversion(user, "emailVerified", "toJS")
    },
    // Session
    createSession: async (data) => {
      const variables: CreateSessionMutationVariables = {
        data: formatDateConversion(data, "expires", "toDatabase"),
      }
      const { insert_sessions_one } =
        await client.request<CreateSessionMutation>(
          CreateSessionDocument.toString(),
          variables
        )
      const session = useFragment(SessionFragmentDoc, insert_sessions_one)

      if (!session) {
        throw new Error("Error creating session")
      }
      session.expires
      return formatDateConversion(session, "expires", "toJS")
    },
    getSessionAndUser: async (sessionToken) => {
      const variables: GetSessionAndUserQueryVariables = {
        sessionToken,
      }
      const { sessions } = await client.request<GetSessionAndUserQuery>(
        GetSessionAndUserDocument.toString(),
        variables
      )
      const session = sessions?.[0]

      if (!session) {
        return null
      }

      const { user, ...sessionData } = session

      return {
        session: formatDateConversion(
          useFragment(SessionFragmentDoc, sessionData),
          "expires",
          "toJS"
        ),
        user: formatDateConversion(
          useFragment(UserFragmentDoc, user),
          "emailVerified",
          "toJS"
        ),
      }
    },
    updateSession: async ({ sessionToken, ...data }) => {
      const variables: UpdateSessionMutationVariables = {
        sessionToken,
        data: formatDateConversion(data, "expires", "toDatabase"),
      }
      const { update_sessions } = await client.request<UpdateSessionMutation>(
        UpdateSessionDocument.toString(),
        variables
      )
      const session = update_sessions?.returning?.[0]

      if (!session) {
        return null
      }

      return formatDateConversion(
        useFragment(SessionFragmentDoc, session),
        "expires",
        "toJS"
      )
    },
    deleteSession: async (sessionToken) => {
      const variables: DeleteSessionMutationVariables = {
        sessionToken,
      }
      const { delete_sessions } = await client.request<DeleteSessionMutation>(
        DeleteSessionDocument.toString(),
        variables
      )
      const session = delete_sessions?.returning?.[0]

      if (!session) {
        return null
      }

      return formatDateConversion(
        useFragment(SessionFragmentDoc, session),
        "expires",
        "toJS"
      )
    },
    // Account
    linkAccount: async (data) => {
      const variables: CreateAccountMutationVariables = { data }
      const { insert_accounts_one } =
        await client.request<CreateAccountMutation>(
          CreateAccountDocument.toString(),
          variables
        )

      if (!insert_accounts_one) {
        return
      }

      const account = useFragment(
        AccountFragmentDoc,
        insert_accounts_one
      ) as NonNullify<
        Omit<AccountFragment, "type"> & { type: "email" | "oauth" | "oidc" }
      >
      if (account) {
        return account as AdapterAccount
      }
    },
    unlinkAccount: async ({ providerAccountId, provider }) => {
      const variables: DeleteAccountMutationVariables = {
        provider,
        providerAccountId,
      }
      const { delete_accounts } = await client.request<DeleteAccountMutation>(
        DeleteAccountDocument.toString(),
        variables
      )
      const account = delete_accounts?.returning[0]

      if (!account) {
        return undefined
      }

      const accountFragment = useFragment(
        AccountFragmentDoc,
        account
      ) as NonNullify<
        Omit<AccountFragment, "type"> & { type: "email" | "oauth" | "oidc" }
      >
      if (accountFragment) {
        return accountFragment as AdapterAccount
      }
    },
    // Verification Token
    createVerificationToken: async (data) => {
      const variables: CreateVerificationTokenMutationVariables = {
        data: formatDateConversion(data, "expires", "toDatabase"),
      }
      const { insert_verification_tokens_one } =
        await client.request<CreateVerificationTokenMutation>(
          CreateVerificationTokenDocument.toString(),
          variables
        )

      if (!insert_verification_tokens_one) {
        return null
      }

      return formatDateConversion(
        useFragment(
          VerificationTokenFragmentDoc,
          insert_verification_tokens_one
        ),
        "expires",
        "toJS"
      )
    },
    useVerificationToken: async ({ identifier, token }) => {
      const variables: DeleteVerificationTokenMutationVariables = {
        identifier,
        token,
      }
      const { delete_verification_tokens } =
        await client.request<DeleteVerificationTokenMutation>(
          DeleteVerificationTokenDocument.toString(),
          variables
        )
      const verificationToken = delete_verification_tokens?.returning?.[0]

      if (!verificationToken) {
        return null
      }

      return formatDateConversion(
        useFragment(VerificationTokenFragmentDoc, verificationToken),
        "expires",
        "toJS"
      )
    },
  }
}
