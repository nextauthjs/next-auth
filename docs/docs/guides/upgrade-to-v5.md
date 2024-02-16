---
title: Upgrade Guide (v5)
---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

NextAuth.js version 5 is a complete rewrite of the package, but we made sure to introduce as little breaking changes as possible. For anything else, we summed up the necessary changes in this guide.

Try it out by running:

```bash npm2yarn
npm install next-auth@beta
```

## New Features

First, let's see what is new!

- App Router-first (`pages/` still supported).
- OAuth support on preview deployments: [Read more](/getting-started/deployment#securing-a-preview-deployment).
- Simplified set up (shared config, inferred [env variables](/reference/nextjs#environment-variable-inferrence)).
- Fully Edge-compatible, thanks to rewriting on top of Auth.js. [Read more](/reference/core).
- Universal `auth()`. Remember a single method, and authenticate anywhere. Replaces `getServerSession`, `getSession`, `withAuth`, `getToken` and `useSession` in most cases. [Read more](#authenticating-server-side).

## Breaking Changes

- NextAuth.js now builds on `@auth/core` with stricter [OAuth](https://www.ietf.org/rfc/rfc6749.html)/[OIDC](https://openid.net/specs/openid-connect-core-1_0.html) spec-compliance, which might break some existing OAuth providers. See our [open issues](https://github.com/nextauthjs/next-auth/issues?q=is%3Aopen+is%3Aissue+label%3Aproviders) for more details.
- OAuth 1.0 support is deprecated.
- Minimum required Next.js version is now [13.4](https://nextjs.org/13-4).
- The import `next-auth/next` is replaced. See [Authenticating server-side](#authenticating-server-side) for more details.
- The import `next-auth/middleware` is replaced. See [Authenticating server-side](#authenticating-server-side) for more details.
- The import `next-auth/jwt` is replaced. See [Authenticating server-side](#authenticating-server-side) for more details.
- The import `next-auth/adapters` is replaced. See [Authenticating server-side](#authenticating-server-side) for more details.
- If you are using a **database adapter** and passing it additional fields from your provider, the default behaviour has changed. We used to automatically pass on all fields from the provider to the adapter. **We no longer pass on all returned fields from your provider(s) to the adapter by default**. We listened to the community, and decided to revert this to a similar state as it was in v3. You must now manually pass on your chosen fields in the provider's `account` callback, if the default is not working for you. See: [`account()` docs](/reference/core/providers#account).

## Configuration

We worked hard to avoid having to save your config options in a separate file and then pass them around as `authOptions` throughout your application. To achieve this, we settled on moving the configuration file to the root of the repository and having it export an `auth` function you can use everywhere else.

An example of the new configuration file format is as follows, as you can see it looks very similar to the existing one.

```ts title="./auth.ts"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [GitHub],
})
```

This then allows you to import the functions exported from this file elsewhere in your codebase via import statements like one of the following.

```ts
import { auth } from "../path-to-config/auth"
```

The old configuration file, contained in the API Route (`pages/api/auth/[...nextauth].ts`), now becomes a 1-line handler for `GET` and `POST` requests for those paths.

```ts title="app/api/auth/[...nextauth]/route.ts"
export { GET, POST } from "./auth"
export const runtime = "edge" // optional
```

## Authenticating server-side

NextAuth.js has had a few different ways to authenticate server-side in the past, and we've tried to simplify this as much as possible.

Now that Next.js components are **server-first** by default, and thanks to the investment in using standard Web APIs, we were able to simplify the authentication process to a single `auth()` function that you can use anywhere.

See the table below for a summary of the changes, and click on the links to learn more about each one.

| Where                                                         | v4                                                    | v5                               |
| ------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| [Server Component](/reference/nextjs#in-server-components)    | `getServerSession(authOptions)`                       | `auth()` call                    |
| [Middleware](/reference/nextjs#in-middleware)                 | `withAuth(middleware, subset of authOptions)` wrapper | `auth` export / `auth()` wrapper |
| [Client Component](/reference/nextjs/react#usesession)        | `useSession()` hook                                   | `useSession()` hook              |
| [Route Handler](/reference/nextjs#in-route-handlers)          | _Previously not supported_                            | `auth()` wrapper                 |
| [API Route (Edge)](/reference/nextjs#in-edge-api-routes)      | _Previously not supported_                            | `auth()` wrapper                 |
| [API Route (Node.js)](/reference/nextjs#in-api-routes)        | `getServerSession(req, res, authOptions)`             | `auth(req, res)` call            |
| [API Route (Node.js)](/reference/nextjs#in-api-routes)        | `getToken(req)` (No session rotation)                 | `auth(req, res)` call            |
| [getServerSideProps](/reference/nextjs#in-getserversideprops) | `getServerSession(ctx.req, ctx.res, authOptions)`     | `auth(ctx)` call                 |
| [getServerSideProps](/reference/nextjs#in-api-routes)         | `getToken(ctx.req)` (No session rotation)             | `auth(req, res)` call            |

### Authentication methods

<Tabs groupId="authentication-method" queryString>
<TabItem value="api-route" label="API Route (Node.js)">

Instead of importing `getServerSession` from `next-auth/next` or `getToken` from `next-auth/jwt`, you can now import the `auth` function from your config file and call it without passing `authOptions`.

```diff title='pages/api/example.ts'
- import { getServerSession } from "next-auth/next"
- import { getToken } from "next-auth/jwt"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
+ import { auth } from "../auth"
+ import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
-  const session = await getServerSession(req, res, authOptions)
-  const token = await getToken({ req })
+  const session = await auth(req, res)
  if (session) return res.json('Success')
  return res.status(401).json("You must be logged in.");
}
```

:::tip
Whenever `auth()` is passed the res object, it will rotate the session expiry. This was not the case with `getToken()` previously.
The default session expiry is 30 days, but you can change it by setting `authOptions.session.maxAge`.
:::

</TabItem>
<TabItem value="get-serverside-props" label="getServerSideProps">

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

</TabItem>
<TabItem value="middleware" label="Middleware">

```diff title='middleware.ts'
- export { default } from 'next-auth/middleware'
+ export { auth as default } from "./auth"
```

For advanced use cases, you can use `auth` as a wrapper for your Middleware:

```ts title="middleware.ts"
import { auth } from "./auth"

export default auth((req) => {
  // req.auth
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
```

Read the [Middleware docs](/reference/nextjs#in-middleware) for more details.

</TabItem>
<TabItem value="server-component" label="Server Component" default>

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

</TabItem>
<TabItem value="client-component" label="Client Component">

Imports from `next-auth/react` are now marked with the `"use client"` directive. [Read more](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive).

If you have previously used `getSession()` or other imports server-side, you'll have to change it to use the [`auth()`](/reference/nextjs#auth) method instead.

`getCsrfToken` and `getProviders` are still available as imports, but we plan to deprecate them in the future and introduce a new API to get this data server-side.

Client-side: Instead of using these APIs, you can make a fetch request to the `/api/auth/providers` and `/api/auth/csrf` endpoints respectively.

Server-side: Get the list of providers from your config's `providers` array.

</TabItem>
</Tabs>

## Adapters

### Adapter packages

Beginning with `next-auth` v5, you should now install database adapters from the `@auth/*-adapter` scope, instead of `@next-auth/*-adapter`.

This is because Database Adapters don't rely on any Next.js features, so it made sense to move them to this new scope.

Example:

```diff
- npm install @next-auth/prisma-adapter
+ npm install @auth/prisma-adapter
```

Check out the [Adapters docs](/reference/core/adapters) for a list of official adapters, or the [Create a database adapter](/guides/adapters/creating-a-database-adapter) guide to learn how to create your own.

### Adapter type

The `Adapter` type is uncommon, unless you are writing your own adapter. If you are using an existing adapter, you can likely ignore this change.

Otherwise, the `Adapter` type can now be imported from `@auth/core/adapters` instead of `next-auth/adapters`.

```diff title="pages/api/auth/[...nextauth].ts"
- import type { Adapter } from "next-auth/adapters"
+ import type { Adapter } from "@auth/core/adapters"
```

This is because the - previously - NextAuth.js scoped [`@next-auth/*-adapter`](https://www.npmjs.com/search?q=next-auth%20adapter) database adapters should work in any framework the same way (there is nothing Next.js specific in these adapters), so it was unnecessary to keep this type tied to the `next-auth` package.

### Database Migrations

NextAuth.js v5 does not introduce any breaking changes to the database schema. However, since OAuth 1.0 support is dropped, the already optional `oauth_token_secret` and `oauth_token` fields can be removed from the `account` table, if you are not using them.

Furthermore, previously uncommon fields like GitHub's `refresh_token_expires_in` fields were required to be added to the `account` table. This is no longer the case, and you can remove it if you are not using it. If you do, make sure to return it via the new [`account()` callback](/reference/core/providers#account).

## Edge compatibility

While NextAuth.js strictly uses standard [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) (and thus can run in any environments that support that), some libraries or ORMs (Object-Relational Mapping) packages that you rely on might not be ready yet. In this case, you can split the auth configuration into multiple files. The following is an example of how to do this with a database adapter.

NextAuth.js supports two session strategies. When you are using an adapter, you can choose to save the session data into a database. Unless your database and its adapter is compatible with the Edge runtime/infrastructure, you will not be able to use a `"database"` session strategy.

Most adapters rely on an ORM/library that is not yet compatible with the Edge runtime. So here is how you can work around it, by forcing a JWT session strategy:

:::note
The following filenames are only a convention we chose, the filenames/structure can be anything you like.
:::

1. Create an `auth.config.ts` file with your config and export it:

```ts title="auth.config.ts"
import GitHub from "next-auth/providers/github"

import type { NextAuthConfig } from "next-auth"

export default {
  providers: [GitHub],
} satisfies NextAuthConfig
```

2. Create an `auth.ts` file and add your adapter there, together with the `jwt` session strategy:

```ts title="auth.ts"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
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

```diff title="middleware.ts"
- export { auth as middleware } from './auth'
+ import authConfig from "./auth.config"
+ import NextAuth from "next-auth"
+ export const { auth: middleware } = NextAuth(authConfig)
```

That's it! Now you can keep using a database for user data, even if your adapter is not compatible with the Edge runtime yet, by forcing the session strategy to be JWT.

Please follow up with your database/ORM's maintainer to see if they are planning to support the Edge runtime/infrastructure.

## TypeScript

- `NextAuthOptions` is renamed to `NextAuthConfig`
- `Adapter` from `next-auth/adapters` is moved to `@auth/core/adapters`. If you are creating a custom adapter, use `@auth/core` instead of `next-auth`.

## Summary

We hope this migration goes smoothly for everyone! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
