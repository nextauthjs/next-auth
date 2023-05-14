---
title: Upgrade Guide (v5)
---

NextAuth.js version 5 is a complete rewrite of the package, but we made sure to introduce as little breaking changes as possible. For anything else, we summed up the necessary changes in this guide.

Upgrade to the latest version by running:

```bash npm2yarn2pnpm
npm install next-auth@latest
```

## New Features

First, let's see what is new!

- App Router-first (`pages/` still supported). Read the migration guide to learn more.
- OAuth support on preview deployments: [Read more](/guides/basics/deployment#securing-a-preview-deployment).
- Simplified init (shared config, inferred [env variables](/reference/nextjs#environment-variable-inferrence)). Read the migration guide to learn more.
- Fully Edge-compatible, thanks to rewriting on top of Auth.js. [Read more](/reference/core).
- Universal `auth()`. Remember a single method, and authenticate anywhere. Replaces `getServerSession`, `getSession`, `withAuth`, `getToken` and `useSession` in most cases. [Read more](/reference/nextjs#auth).

## Breaking Changes

- Minimum required Next.js version is now [13.4](https://nextjs.org/13-4).
- OAuth 1.0 support is deprecated.
- The import `next-auth/next` is replaced. See [Authenticating server-side](#authenticating-server-side) for more details.
- The import `next-auth/middleware` is replaced. See [Authenticating server-side](#authenticating-server-side) for more details.
- The import `next-auth/jwt` is replaced. See [Authenticating server-side](#authenticating-server-side) for more details.
- If you are using a **database adapter** and passing it additional fields from your provider, the default behaviour has changed. We used to automatically pass on all fields from the provider to the adapter. **We no longer pass on all returned fields from your provider(s) to the adapter by default**. We listened to the community, and decided to revert this to a similar state as it was in v3. You must now manually pass on your chosen fields in the provider's `account` callback, if the default is not working for you. See: [`account()` docs](/reference/core/providers#account).

## Configuration

We worked hard to avoid having to save your config options in a separate file and then pass them around as `authOptions` throughout your application. To achieve this, we settled on moving the configuration file to the root of the repository and having it export an `auth` function you can use everywhere else.

An example of the new configuration file format is as follows, as you can see it looks very similar to the existing one.

```ts title="./auth.ts"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { handlers, auth } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(credentials) {
        if (credentials.password !== "password") return null
        return { id: "test", name: "Test User", email: "test@example.com" }
      },
    }),
  ],
})
```

This then allows you to import the functions exported from this file elsewhere in your codebase via import statements like one of the following.

```ts
import { auth } from '../path-to-config/auth'
```

The old configuration file, contained in the API Route (`pages/api/auth/[...nextauth].ts`), now becomes a 2-line handler for `GET` and `POST` requests for those paths.

```ts title="app/api/auth/[...nextauth]/route.ts"
import { handlers } from "./auth"
export const { GET, POST } = handlers
export const runtime = "edge" // optional
```

## Authenticating server-side

NextAuth.js has had a few different ways to authenticate server-side in the past, and we've tried to simplify this as much as possible.

Now that Next.js components are **server first** by default, and their investment on usig Web standard APIs, we were able to simplify the authentication process to a single `auth()` function that you can use anywhere.

:::note
When using `auth()`, the [`session()` callback](/reference/core/types#session) is ignored. `auth()` will expose anything returned from the [`jwt()` callback](reference/core/types#jwt) or if using a [`"database"` strategy](/reference/core#session), from the [User](/reference/adapters#user). This is because the `session()` callback was designed to protect you from exposing sensitive information to the client, but when using `auth()` you are always on the server.
:::

See the table below for a summary of the changes, and click on the links to learn more about each one.

| Where                                     | Old                                                   | New                              |
| ----------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| [Server Component](#server-component)     | `getServerSession(authOptions)`                       | `auth()` call                    |
| [Middleware](#middleware)                 | `withAuth(middleware, subset of authOptions)` wrapper | `auth` export / `auth()` wrapper |
| [Client Component](#client-component)     | `useSession()` hook                                   | `useSession()` hook              |
| [Route Handler](/reference/nextjs#in-route-handlers)           | _Previously not supported_                            | `auth()` wrapper                 |
| [API Route (Edge)](/reference/nextjs#in-edge-api-routes)       | _Previously not supported_                            | `auth()` wrapper                 |
| [API Route (Node)](#api-route-node)       | `getServerSession(req, res, authOptions)`             | `auth(req, res)` call            |
| [API Route (Node)](#api-route-node)       | `getToken(req)` (No session rotation)                 | `auth(req, res)` call            |
| [getServerSideProps](#getserversideprops) | `getServerSession(ctx.req, ctx.res, authOptions)`     | `auth(ctx)` call                 |
| [getServerSideProps](#getserversideprops) | `getToken(ctx.req)` (No session rotation)             | `auth(req, res)` call            |



### API Route (Node)

Instead of importing `getServerSession` from `next-auth/next` or `getToken` from `next-auth/jwt`, you can now import the `auth` function from your config file and call it without passing `authOptions`.

```diff title='pages/api/example.ts'
- import { getServerSession } from "next-auth/next"
- import { getToken } from "next-auth/jwt"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
+ import { auth } from "../auth"

export default async function handler(req, res) {
-  const session = await getServerSession(req, res, authOptions)
-  const token = await getToken({ req })
+  const session = await auth(req, res)
  if (session) return res.json('Success')
  return res.status(401).json("You must be logged in.");
}
```

:::tip
Whenever `auth()` is passed the res object, it will rotate the session expiry. This was not the case with `getToken()` previously.
:::

### `getServerSideProps`

Instead of importing `getServerSession` from `next-auth/next` or `getToken` from `next-auth/jwt`, you can now import the `auth` function from your config file and call it without passing `authOptions`.

```diff title="pages/protected.tsx"
- import { getServerSession } from "next-auth/next"
- import { getToken } from "next-auth/jwt"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
+ import { auth } from "../auth"

export const getServerSideProps: GetServerSideProps = async (context) => {
-  const session = await getServerSession(context.req, context.res, authOptions)
-  const token = await getToken({ req: context.req })
+  const session = await auth(context)
  if (session) // Do something with the session

  return { props: { session } }
}
```

:::tip
Whenever `auth()` is passed the res object, it will rotate the session expiry. This was not the case with `getToken()` previously.
:::

### Middleware

```diff title="middleware.ts"
- export { default } from 'next-auth/middleware'
+ export { auth as default } from "./auth"
```

For advanced use cases, you can use `auth` as a wrapper for your Middleware:

```ts title="middleware.ts"
import { auth } from "./auth"

export default auth(req => {
  // req.auth
})
```

Read the [Middleware docs](/reference/nextjs#in-middleware) for more details.

### Server Component

NextAuth.js v4 has supported reading the session in Server Components for a while via `getServerSession`. This has been also simplified to the same `auth()` function.

```diff title="app/page.tsx"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
- import { getServerSession } from "next-auth/next"
+ import { auth } from "../auth"

export default async function Page() {
-  const session = await getServerSession(authOptions)
+  const session = await auth()
  return (<p>Welcome {session?.user.name}!</p>)
}
```

### Client Component

Imports from `next-auth/react` are now marked with the `"use client"` directive. [Read more](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive).

If you have previously used `getSession()` or other imports server-side, you'll have to change it to use the [`auth()`](/reference/nextjs#auth) method instead.

`getCsrfToken` and `getProviders` are still available as imports, but we plan to deprecate them in the future and introduce a new API to get this data server-side.

Client side: Instead of using these APIs, you can make a fetch request to the `/api/auth/providers` and `/api/auth/csrf` endpoints respectively.

Server-side: TBD

## Adapters

### Database Migrations

NextAuth.js v5 does not introduce any breaking changes to the database schema. However, since OAuth 1.0 support is dropped, the already optional `oauth_token_secret` and `oauth_token` fields can be removed from the `account` table, if you are not using them.

Furthermore, previously uncommon fields like GitHub's `refresh_token_expires_in` fields were required to be added to the `account` table. This is no longer the case, and you can remove it if you are not using it. if you do, make sure to return it via the new [`acconut()` callback](/reference/core/providers#account)


### Edge compatibility

NextAuth.js supports to session strategies. When you are using an adapter, you can choose to save the session data into a database. Unless your database and it's adapter is compatible with the Edge runtime/infrastructure, you will not be able to use a "database" session strategy.

:::note
If you are using a sufficiently fast and Edge-compatible database ORM/library, you can ignore this section.
:::

Most adapters rely on an ORM/library that is not yet compatible with the Edge runtime. So here is how you can work around it:

:::note
The following is only a convention we chose, the filenames/structure have no important meaning, as long as you import the correct files in the correct places.
:::

1. Create an `auth.config.ts` with your config and export it:

```ts title="auth.config.ts"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    GitHub,
    Credentials({
      credentials: { password: { label: "Password", type: "password" } },
      authorize(credentials) {
        if (credentials.password !== "password") return null
        return { id: "test", name: "Test User", email: "test@example.com" }
      },
    }),
  ],
} satisfies NextAuthConfig
```

2. Create an `auth.ts` file and add your adapter there, together with the `jwt` session strategy:

```ts title="auth.ts"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"

const prisma = new PrismaClient()

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
})
```

3. Make sure that Middleware is not using the import with a non-edge compatible adapter:

```diff title="pages/api/auth/[...nextauth].ts"
- export { auth as middleware } from './auth'
+ import authConfig from "./auth.config"
+ import NextAuth from "@auth/nextjs"
+ export const { auth: middleware } = NextAuth(authConfig)
```

That's it! Now you can keep using a database for user data, even if your adapter is not compatible with the Edge runtime.

## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
