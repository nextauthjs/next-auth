---
id: hasura
title: Hasura
---

# Hasura

This is the Hasura Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Setup

1. Create the next-auth schema in your database using SQL.

   ```sql
   CREATE TABLE accounts (
       id uuid DEFAULT gen_random_uuid() NOT NULL,
       type text NOT NULL,
       provider text NOT NULL,
       "providerAccountId" text NOT NULL,
       refresh_token text,
       access_token text,
       expires_at bigint,
       token_type text,
       scope text,
       id_token text,
       session_state text,
       oauth_token_secret text,
       oauth_token text,
       "userId" uuid NOT NULL,
       refresh_token_expires_in bigint
   );

   CREATE TABLE sessions (
       "sessionToken" text NOT NULL,
       "userId" uuid NOT NULL,
       expires timestamptz NOT NULL
   );

   CREATE TABLE users (
       id uuid DEFAULT gen_random_uuid() NOT NULL,
       name text,
       email text NOT NULL,
       "emailVerified" timestamptz,
       image text
   );

   CREATE TABLE verification_tokens (
       token text NOT NULL,
       identifier text NOT NULL,
       expires timestamptz NOT NULL
   );

   CREATE TABLE provider_type (
       value text NOT NULL
   );

   ALTER TABLE ONLY accounts
       ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);

   ALTER TABLE ONLY sessions
       ADD CONSTRAINT sessions_pkey PRIMARY KEY ("sessionToken");

   ALTER TABLE ONLY users
       ADD CONSTRAINT users_email_key UNIQUE (email);

   ALTER TABLE ONLY users
       ADD CONSTRAINT users_pkey PRIMARY KEY (id);

   ALTER TABLE ONLY verification_tokens
       ADD CONSTRAINT verification_tokens_pkey PRIMARY KEY (token);

   ALTER TABLE ONLY provider_type
       ADD CONSTRAINT provider_type_pkey PRIMARY KEY (value);

   ALTER TABLE ONLY accounts
       ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;

   ALTER TABLE ONLY sessions
       ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE CASCADE;

   INSERT INTO provider_type (value) VALUES ('credentials'), ('email'), ('oauth');

   ALTER TABLE ONLY accounts
       ADD CONSTRAINT "accounts_type_fkey" FOREIGN KEY ("type") REFERENCES public.provider_type(value) ON UPDATE RESTRICT ON DELETE RESTRICT;

   ```

1. [Track all the tables and relationships in Hasura](https://hasura.io/docs/latest/schema/postgres/using-existing-database/#step-1-track-tablesviews)

1. Install the necessary packages

   ```bash npm2yarn2pnpm
   npm install next-auth @next-auth/hasura-adapter graphql graphql-request
   ```

1. Configure your NextAuth.js to use the Hasura Adapter:

   ```javascript title="pages/api/auth/[...nextauth].js"
   import NextAuth from "next-auth"
   import { HasuraAdapter } from "@next-auth/hasura-adapter"

   // For more information on each option (and a full list of options) go to
   // https://next-auth.js.org/configuration/options
   export default nextAuth({
   adapter: HasuraAdapter({
       endpoint: "<Hasura-GraphQL-endpoint>",
       adminSecret: "<admin-secret>",
       graphqlRequestOptions: {
       // Optional graphql-request options
       },
   }),
   ...
   })
   ```

## Passing dynamic headers

If you use [graphql-request's dynamic headers feature](https://github.com/prisma-labs/graphql-request#passing-dynamic-headers-to-the-client), you are responsible for passing the 'X-Hasura-Admin-Secret' header

```js
export default nextAuth({
  adapter: HasuraAdapter({
    endpoint: "<Hasura-GraphQL-endpoint>",
    adminSecret: "<admin-secret>",
    graphqlRequestOptions: {
      headers: () => ({
        "X-Hasura-Admin-Secret": "<admin-secret>",
        // your headers here
      }),
    },
  }),
  ...
})
```
