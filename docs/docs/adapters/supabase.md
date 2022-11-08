---
id: supabase
title: Supabase
---

# Supabase

This is the Supabase Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

:::note
This adapter is developed by the community and not officially maintained or supported by Supabase. It uses the Supabase Database to store user and session data in a separate `next_auth` schema. It is a standalone Auth server that does not interface with Supabase Auth and therefore provides a different feature set.

If you’re looking for an officially maintained Auth server with additional features like [built-in email server](https://supabase.com/docs/guides/auth/auth-email#configure-email-settings?utm_source=next-auth-docs&medium=referral&campaign=next-auth), [phone auth](https://supabase.com/docs/guides/auth/auth-twilio?utm_source=next-auth-docs&medium=referral&campaign=next-auth), and [Multi Factor Authentication (MFA / 2FA)](https://supabase.com/contact/mfa?utm_source=next-auth-docs&medium=referral&campaign=next-auth), please use [Supabase Auth](https://supabase.com/auth) with the [Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs?utm_source=next-auth-docs&medium=referral&campaign=next-auth).
:::

## Getting Started

1. Install `@supabase/supabase-js`, `next-auth` and `@next-auth/supabase-adapter`.

```bash npm2yarn2pnpm
npm install @supabase/supabase-js next-auth @next-auth/supabase-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [...],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  // ...
})
```

## Setup

### Create the `next_auth` schema in Supabase

Setup your database as described in our main [schema](/adapters/models), by copying the SQL schema below in the Supabase [SQL Editor](https://app.supabase.com/project/_/sql).

Alternatively you can select the NextAuth Quickstart card on the [SQL Editor page](https://app.supabase.com/project/_/sql), or [create a migration with the Supabase CLI](https://supabase.com/docs/guides/cli/local-development#database-migrations?utm_source=next-auth-docs&medium=referral&campaign=next-auth).

```sql
--
-- Name: next_auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--
CREATE SCHEMA next_auth;

ALTER SCHEMA next_auth OWNER TO supabase_admin;

GRANT USAGE ON SCHEMA next_auth TO anon;
GRANT USAGE ON SCHEMA next_auth TO authenticated;
GRANT USAGE ON SCHEMA next_auth TO service_role;
GRANT ALL ON SCHEMA next_auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA next_auth TO dashboard_user;
GRANT ALL ON SCHEMA next_auth TO postgres;

--
-- Create users table
--
CREATE TABLE IF NOT EXISTS next_auth.users
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text,
    email text,
    "emailVerified" timestamp with time zone,
    image text,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

GRANT ALL ON TABLE next_auth.users TO dashboard_user;
GRANT ALL ON TABLE next_auth.users TO postgres;
GRANT ALL ON TABLE next_auth.users TO service_role;

--- uid() function to be used in RLS policies
CREATE FUNCTION next_auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select
  	coalesce(
		nullif(current_setting('request.jwt.claim.sub', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
	)::uuid
$$;

--
-- Create sessions table
--
CREATE TABLE IF NOT EXISTS  next_auth.sessions
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    expires timestamp with time zone,
    "sessionToken" text,
    "userId" uuid,
    CONSTRAINT sessions_pkey PRIMARY KEY (id),
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES  next_auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.sessions TO dashboard_user;
GRANT ALL ON TABLE next_auth.sessions TO postgres;
GRANT ALL ON TABLE next_auth.sessions TO service_role;

--
-- Create accounts table
--
CREATE TABLE IF NOT EXISTS  next_auth.accounts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    type text,
    provider text,
    "providerAccountId" text,
    refresh_token text,
    access_token text,
    expires_at bigint,
    token_type text,
    scope text,
    id_token text,
    session_state text,
    oauth_token_secret text,
    oauth_token text,
    "userId" uuid,
    CONSTRAINT accounts_pkey PRIMARY KEY (id),
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES  next_auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

GRANT ALL ON TABLE next_auth.accounts TO dashboard_user;
GRANT ALL ON TABLE next_auth.accounts TO postgres;
GRANT ALL ON TABLE next_auth.accounts TO service_role;

--
-- Create verification_tokens table
--
CREATE TABLE IF NOT EXISTS  next_auth.verification_tokens
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    identifier text,
    token text,
    expires timestamp with time zone,
    CONSTRAINT verification_tokens_pkey PRIMARY KEY (id)
);

GRANT ALL ON TABLE next_auth.verification_tokens TO dashboard_user;
GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;
```

### Expose the `next_auth` schema in Supabase

Expose the `next_auth` schema via the Serverless API in the [API settings](https://app.supabase.com/project/_/settings/api) by adding `next_auth` to the "Exposed schemas" list.

When developing locally add `next_auth` to the `schemas` array in the `config.toml` file in the `supabase` folder that was generated by the [Supabase CLI](https://supabase.com/docs/guides/cli/local-development#initialize-your-project?utm_source=next-auth-docs&medium=referral&campaign=next-auth).

## Enabling Row Level Security (RLS)

Postgres provides a powerful feature called [Row Level Security (RSL)](https://supabase.com/docs/guides/auth/row-level-security?utm_source=next-auth-docs&medium=referral&campaign=next-auth) to limit access to data.

This works by sending a signed JWT to your [Supabase Serverless API](https://supabase.com/docs/guides/api?utm_source=next-auth-docs&medium=referral&campaign=next-auth). There is two steps to make this work with NextAuth:

### 1. Generate the Supabase `access_token` JWT in the session callback

To sign the JWT use the `jsonwebtoken` package:

```bash npm2yarn2pnpm
npm install jsonwebtoken
```

Using the [NexthAuth Session callback](https://next-auth.js.org/configuration/callbacks#session-callback) create the Supabase `access_token` and append it to the `session` object.

To sign the JWT use the Supabase JWT secret which can be found in the [API settings](https://app.supabase.com/project/_/settings/api)

```js title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import jwt from "jsonwebtoken"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [...],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
	callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET
      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        }
        session.supabaseAccessToken = jwt.sign(payload, signingSecret)
      }
      return session
    },
  },
  // ...
})
```

### 2. Inject the Supabase `access_token` JWT into the Supabase Client

For example, given the following public schema:

```sql
/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from next_auth.users
  id uuid not null primary key,
  name text,
  email text,
  image text,
  constraint "users_id_fkey" foreign key ("id")
        references  next_auth.users (id) match simple
        on update no action
        on delete cascade -- if user is deleted in NextAuth they will also be deleted in our public table.
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (next_auth.uid() = id);
create policy "Can update own user data." on users for update using (next_auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via NextAuth.
*/
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, image)
  values (new.id, new.name, new.email, new.image);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on next_auth.users
  for each row execute procedure public.handle_new_user();
```

The `supabaseAccessToken` is now available on the `session` object and can be passed to the supabase-js client. This works in any environment: client-side, server-side (API routes, SSR), as well as in middleware edge functions!

```js
// ...
// Use `useSession()` or `unstable_getServerSession()` to get the NextAuth session.

const { supabaseAccessToken } = session

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  }
)
// Now you can query with RLS enabled.
const { data, error } = await supabase.from("users").select("*")
```
