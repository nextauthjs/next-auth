/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p style={{fontWeight: "normal"}}>Official <a href="https://supabase.com/docs">Supabase</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://supabase.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/adapters/supabase.svg" width="50"/>
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @supabase/supabase-js @auth/supabase-adapter
 * ```
 *
 * @module @auth/supabase-adapter
 */
import { createClient } from "@supabase/supabase-js"
import {
  Adapter,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters"

function isDate(date: any) {
  return (
    new Date(date).toString() !== "Invalid Date" && !isNaN(Date.parse(date))
  )
}

export function format<T>(obj: Record<string, any>): T {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      delete obj[key]
    }

    if (isDate(value)) {
      obj[key] = new Date(value)
    }
  }

  return obj as T
}

/**
 * This is the interface of the Supabase adapter options.
 **/
export interface SupabaseAdapterOptions {
  /**
   * The URL of your Supabase database
   **/
  url: string
  /**
   * The secret to grant access to the database
   **/
  secret: string
}

/**
 * :::note
 * This adapter is developed by the community and not officially maintained or supported by Supabase. It uses the Supabase Database to store user and session data in a separate `next_auth` schema. It is a standalone Auth server that does not interface with Supabase Auth and therefore provides a different feature set.
 *
 * If you're looking for an officially maintained Auth server with additional features like [built-in email server](https://supabase.com/docs/guides/auth/auth-email#configure-email-settings?utm_source=authjs-docs&medium=referral&campaign=authjs), [phone auth](https://supabase.com/docs/guides/auth/auth-twilio?utm_source=authjs-docs&medium=referral&campaign=authjs), and [Multi Factor Authentication (MFA / 2FA)](https://supabase.com/contact/mfa?utm_source=authjs-docs&medium=referral&campaign=authjs), please use [Supabase Auth](https://supabase.com/auth) with the [Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs?utm_source=authjs-docs&medium=referral&campaign=authjs).
 * :::
 *
 * ## Setup
 *
 * ### Configure Auth.js
 *
 * Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { SupabaseAdapter } from "@auth/supabase-adapter"
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/core#authconfig
 * export default NextAuth({
 *   // https://authjs.dev/reference/core/providers
 *   providers: [...],
 *   adapter: SupabaseAdapter({
 *     url: process.env.NEXT_PUBLIC_SUPABASE_URL,
 *     secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
 *   }),
 *   // ...
 * })
 * ```
 *
 * ### Create the NextAuth schema in Supabase
 *
 * Setup your database as described in our main [schema](https://authjs.dev/reference/core/adapters#models), by copying the SQL schema below in the Supabase [SQL Editor](https://app.supabase.com/project/_/sql).
 *
 * Alternatively you can select the NextAuth Quickstart card on the [SQL Editor page](https://app.supabase.com/project/_/sql), or [create a migration with the Supabase CLI](https://supabase.com/docs/guides/cli/local-development#database-migrations?utm_source=authjs-docs&medium=referral&campaign=authjs).
 *
 * ```sql
 * --
 * -- Name: next_auth; Type: SCHEMA;
 * --
 * CREATE SCHEMA next_auth;
 *
 * GRANT USAGE ON SCHEMA next_auth TO service_role;
 * GRANT ALL ON SCHEMA next_auth TO postgres;
 *
 * --
 * -- Create users table
 * --
 * CREATE TABLE IF NOT EXISTS next_auth.users
 * (
 *     id uuid NOT NULL DEFAULT uuid_generate_v4(),
 *     name text,
 *     email text,
 *     "emailVerified" timestamp with time zone,
 *     image text,
 *     CONSTRAINT users_pkey PRIMARY KEY (id),
 *     CONSTRAINT email_unique UNIQUE (email)
 * );
 *
 * GRANT ALL ON TABLE next_auth.users TO postgres;
 * GRANT ALL ON TABLE next_auth.users TO service_role;
 *
 * --- uid() function to be used in RLS policies
 * CREATE FUNCTION next_auth.uid() RETURNS uuid
 *     LANGUAGE sql STABLE
 *     AS $$
 *   select
 *   	coalesce(
 * 		nullif(current_setting('request.jwt.claim.sub', true), ''),
 * 		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
 * 	)::uuid
 * $$;
 *
 * --
 * -- Create sessions table
 * --
 * CREATE TABLE IF NOT EXISTS  next_auth.sessions
 * (
 *     id uuid NOT NULL DEFAULT uuid_generate_v4(),
 *     expires timestamp with time zone NOT NULL,
 *     "sessionToken" text NOT NULL,
 *     "userId" uuid,
 *     CONSTRAINT sessions_pkey PRIMARY KEY (id),
 *     CONSTRAINT sessionToken_unique UNIQUE ("sessionToken"),
 *     CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId")
 *         REFERENCES  next_auth.users (id) MATCH SIMPLE
 *         ON UPDATE NO ACTION
 *         ON DELETE CASCADE
 * );
 *
 * GRANT ALL ON TABLE next_auth.sessions TO postgres;
 * GRANT ALL ON TABLE next_auth.sessions TO service_role;
 *
 * --
 * -- Create accounts table
 * --
 * CREATE TABLE IF NOT EXISTS  next_auth.accounts
 * (
 *     id uuid NOT NULL DEFAULT uuid_generate_v4(),
 *     type text NOT NULL,
 *     provider text NOT NULL,
 *     "providerAccountId" text NOT NULL,
 *     refresh_token text,
 *     access_token text,
 *     expires_at bigint,
 *     token_type text,
 *     scope text,
 *     id_token text,
 *     session_state text,
 *     oauth_token_secret text,
 *     oauth_token text,
 *     "userId" uuid,
 *     CONSTRAINT accounts_pkey PRIMARY KEY (id),
 *     CONSTRAINT provider_unique UNIQUE (provider, "providerAccountId"),
 *     CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId")
 *         REFERENCES  next_auth.users (id) MATCH SIMPLE
 *         ON UPDATE NO ACTION
 *         ON DELETE CASCADE
 * );
 *
 * GRANT ALL ON TABLE next_auth.accounts TO postgres;
 * GRANT ALL ON TABLE next_auth.accounts TO service_role;
 *
 * --
 * -- Create verification_tokens table
 * --
 * CREATE TABLE IF NOT EXISTS  next_auth.verification_tokens
 * (
 *     identifier text,
 *     token text,
 *     expires timestamp with time zone NOT NULL,
 *     CONSTRAINT verification_tokens_pkey PRIMARY KEY (token),
 *     CONSTRAINT token_unique UNIQUE (token),
 *     CONSTRAINT token_identifier_unique UNIQUE (token, identifier)
 * );
 *
 * GRANT ALL ON TABLE next_auth.verification_tokens TO postgres;
 * GRANT ALL ON TABLE next_auth.verification_tokens TO service_role;
 * ```
 * ### Expose the NextAuth schema in Supabase
 *
 * Expose the `next_auth` schema via the Serverless API in the [API settings](https://app.supabase.com/project/_/settings/api) by adding `next_auth` to the "Exposed schemas" list.
 *
 * When developing locally add `next_auth` to the `schemas` array in the `config.toml` file in the `supabase` folder that was generated by the [Supabase CLI](https://supabase.com/docs/guides/cli/local-development#initialize-your-project?utm_source=authjs-docs&medium=referral&campaign=authjs).
 *
 * ## Advanced usage
 *
 * ### Enabling Row Level Security (RLS)
 *
 * Postgres provides a powerful feature called [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security?utm_source=authjs-docs&medium=referral&campaign=authjs) to limit access to data.
 *
 * This works by sending a signed JWT to your [Supabase Serverless API](https://supabase.com/docs/guides/api?utm_source=authjs-docs&medium=referral&campaign=authjs). There is two steps to make this work with NextAuth:
 *
 * #### Generate the Supabase `access_token` JWT in the session callback
 *
 * To sign the JWT use the `jsonwebtoken` package:
 *
 * ```bash npm2yarn
 * npm install jsonwebtoken
 * ```
 *
 * Using the [NexthAuth.js Session callback](https://authjs.dev/reference/core/types#session) create the Supabase `access_token` and append it to the `session` object.
 *
 * To sign the JWT use the Supabase JWT secret which can be found in the [API settings](https://app.supabase.com/project/_/settings/api)
 *
 * ```js title="pages/api/auth/[...nextauth].js"
 * import NextAuth from "next-auth"
 * import { SupabaseAdapter } from "@auth/supabase-adapter"
 * import jwt from "jsonwebtoken"
 *
 * // For more information on each option (and a full list of options) go to
 * // https://authjs.dev/reference/configuration/auth-options
 * export default NextAuth({
 *   // https://authjs.dev/reference/core/providers
 *   providers: [...],
 *   adapter: SupabaseAdapter({
 *     url: process.env.NEXT_PUBLIC_SUPABASE_URL,
 *     secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
 *   }),
 * 	callbacks: {
 *     async session({ session, user }) {
 *       const signingSecret = process.env.SUPABASE_JWT_SECRET
 *       if (signingSecret) {
 *         const payload = {
 *           aud: "authenticated",
 *           exp: Math.floor(new Date(session.expires).getTime() / 1000),
 *           sub: user.id,
 *           email: user.email,
 *           role: "authenticated",
 *         }
 *         session.supabaseAccessToken = jwt.sign(payload, signingSecret)
 *       }
 *       return session
 *     },
 *   },
 *   // ...
 * })
 * ```
 *
 * #### Inject the Supabase `access_token` JWT into the client
 *
 * For example, given the following public schema:
 *
 * ```sql
 * -- Note: This table contains user data. Users should only be able to view and update their own data.
 * create table users (
 *   -- UUID from next_auth.users
 *   id uuid not null primary key,
 *   name text,
 *   email text,
 *   image text,
 *   constraint "users_id_fkey" foreign key ("id")
 *         references  next_auth.users (id) match simple
 *         on update no action
 *         on delete cascade -- if a user is deleted in NextAuth they will also be deleted in our public table.
 * );
 * alter table users enable row level security;
 * create policy "Can view own user data." on users for select using (next_auth.uid() = id);
 * create policy "Can update own user data." on users for update using (next_auth.uid() = id);
 *
 * -- This trigger automatically creates a user entry when a new user signs up via NextAuth.
 * create function public.handle_new_user()
 * returns trigger as $$
 * begin
 *   insert into public.users (id, name, email, image)
 *   values (new.id, new.name, new.email, new.image);
 *   return new;
 * end;
 * $$ language plpgsql security definer;
 * create trigger on_auth_user_created
 *   after insert on next_auth.users
 *   for each row execute procedure public.handle_new_user();
 * ```
 *
 * The `supabaseAccessToken` is now available on the `session` object and can be passed to the supabase-js client. This works in any environment: client-side, server-side (API routes, SSR), as well as in middleware edge functions!
 *
 * ```js
 * // ...
 * // Use `useSession()` or `unstable_getServerSession()` to get the NextAuth session.
 *
 * const { supabaseAccessToken } = session
 *
 * const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL,
 *   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
 *   {
 *     global: {
 *       headers: {
 *         Authorization: `Bearer ${supabaseAccessToken}`,
 *       },
 *     },
 *   }
 * )
 * // Now you can query with RLS enabled.
 * const { data, error } = await supabase.from("users").select("*")
 * ```
 *  ### Usage with TypeScript
 *
 * You can pass types that were generated with the Supabase CLI to the Supabase Client to get enhanced type safety and auto-completion.
 *
 * Creating a new supabase client object:
 *
 * ```tsx
 * import { createClient } from "@supabase/supabase-js"
 * import { Database } from "../database.types"
 *
 * const supabase = createClient<Database>()
 * ```
 *
 * #### Extend the session type with the `supabaseAccessToken`
 *
 * In order to extend the `session` object with the `supabaseAccessToken` we need to extend the `session` interface in a `types/next-auth.d.ts` file:
 *
 * ```ts title="types/next-auth.d.ts"
 * import NextAuth, { DefaultSession } from "next-auth"
 *
 * declare module "next-auth" {
 *   // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
 *   interface Session {
 *     // A JWT which can be used as Authorization header with supabase-js for RLS.
 *     supabaseAccessToken?: string
 *     user: {
 *       // The user's postal address
 *       address: string
 *     } & DefaultSession["user"]
 *   }
 * }
 * ```
 */
export function SupabaseAdapter(options: SupabaseAdapterOptions): Adapter {
  const { url, secret } = options
  const supabase = createClient<Database, "next_auth">(url, secret, {
    db: { schema: "next_auth" },
    global: { headers: { "X-Client-Info": "@auth/supabase-adapter" } },
    auth: { persistSession: false },
  })
  return {
    async createUser(user) {
      const { data, error } = await supabase
        .from("users")
        .insert({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      return format<AdapterUser>(data)
    },
    async getUser(id) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterUser>(data)
    },
    async getUserByEmail(email) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      return format<AdapterUser>(data)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const { data, error } = await supabase
        .from("accounts")
        .select("users (*)")
        .match({ provider, providerAccountId })
        .maybeSingle()

      if (error) throw error
      if (!data || !data.users) return null

      return format<AdapterUser>(data.users)
    },
    async updateUser(user) {
      const { data, error } = await supabase
        .from("users")
        .update({
          ...user,
          emailVerified: user.emailVerified?.toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single()

      if (error) throw error

      return format<AdapterUser>(data)
    },
    async deleteUser(userId) {
      const { error } = await supabase.from("users").delete().eq("id", userId)

      if (error) throw error
    },
    async linkAccount(account) {
      const { error } = await supabase.from("accounts").insert(account)

      if (error) throw error
    },
    async unlinkAccount({ providerAccountId, provider }) {
      const { error } = await supabase
        .from("accounts")
        .delete()
        .match({ provider, providerAccountId })

      if (error) throw error
    },
    async createSession({ sessionToken, userId, expires }) {
      const { data, error } = await supabase
        .from("sessions")
        .insert({ sessionToken, userId, expires: expires.toISOString() })
        .select()
        .single()

      if (error) throw error

      return format<AdapterSession>(data)
    },
    async getSessionAndUser(sessionToken) {
      const { data, error } = await supabase
        .from("sessions")
        .select("*, users(*)")
        .eq("sessionToken", sessionToken)
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const { users: user, ...session } = data

      return {
        user: format<AdapterUser>(
          user as Database["next_auth"]["Tables"]["users"]["Row"][]
        ),
        session: format<AdapterSession>(session),
      }
    },
    async updateSession(session) {
      const { data, error } = await supabase
        .from("sessions")
        .update({
          ...session,
          expires: session.expires?.toISOString(),
        })
        .eq("sessionToken", session.sessionToken)
        .select()
        .single()

      if (error) throw error

      return format<AdapterSession>(data)
    },
    async deleteSession(sessionToken) {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("sessionToken", sessionToken)

      if (error) throw error
    },
    async createVerificationToken(token) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .insert({
          ...token,
          expires: token.expires.toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabase
        .from("verification_tokens")
        .delete()
        .match({ identifier, token })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) return null

      const { id, ...verificationToken } = data

      return format<VerificationToken>(verificationToken)
    },
  }
}

interface Database {
  next_auth: {
    Tables: {
      accounts: {
        Row: {
          id: string
          type: string | null
          provider: string | null
          providerAccountId: string | null
          refresh_token: string | null
          access_token: string | null
          expires_at: number | null
          token_type: string | null
          scope: string | null
          id_token: string | null
          session_state: string | null
          oauth_token_secret: string | null
          oauth_token: string | null
          userId: string | null
        }
        Insert: {
          id?: string
          type?: string | null
          provider?: string | null
          providerAccountId?: string | null
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
          userId?: string | null
        }
        Update: {
          id?: string
          type?: string | null
          provider?: string | null
          providerAccountId?: string | null
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          oauth_token_secret?: string | null
          oauth_token?: string | null
          userId?: string | null
        }
      }
      sessions: {
        Row: {
          expires: string | null
          sessionToken: string | null
          userId: string | null
          id: string
        }
        Insert: {
          expires?: string | null
          sessionToken?: string | null
          userId?: string | null
          id?: string
        }
        Update: {
          expires?: string | null
          sessionToken?: string | null
          userId?: string | null
          id?: string
        }
      }
      users: {
        Row: {
          name: string | null
          email: string | null
          emailVerified: string | null
          image: string | null
          id: string
        }
        Insert: {
          name?: string | null
          email?: string | null
          emailVerified?: string | null
          image?: string | null
          id?: string
        }
        Update: {
          name?: string | null
          email?: string | null
          emailVerified?: string | null
          image?: string | null
          id?: string
        }
      }
      verification_tokens: {
        Row: {
          id: number
          identifier: string | null
          token: string | null
          expires: string | null
        }
        Insert: {
          id?: number
          identifier?: string | null
          token?: string | null
          expires?: string | null
        }
        Update: {
          id?: number
          identifier?: string | null
          token?: string | null
          expires?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      uid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
