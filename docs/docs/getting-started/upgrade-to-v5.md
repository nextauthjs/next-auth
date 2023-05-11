---
title: Upgrade Guide (v5)
---

NextAuth.js version 5 is a complete rewrite of the package, but we made sure to introduce as little breaking changes as possible. For anything else, we summed up the necessary change in this guide.

Upgrade to the latest version by running:

```bash npm2yarn2pnpm
npm install next-auth@latest
```

## New Features

First, let's see what is new!

- App Router-first (`pages/` still supported). Read the migration guide to learn more.
- OAuth support on preview deployments: [Read more](/guides/basics/deployment#securing-a-preview-deployment).
- Simplified init (shared config, inferred env vars). Read the migration guide to learn more. TODO: mention env inferring
- Fully Edge-compatible, thanks to rewriting on top of Auth.js. [Read more](/reference/core).
- Universal `auth()`. Remember a single method, and authenticate anywhere. Replaces `getServerSession`, `getSession`, `withAuth`, `getToken` and `useSession` in most cases. [Read more](/reference/nextjs#auth).


## Getting Started

Below is a summary of the high-level API changes in `next-auth` v5. Most of these methods were doing 1 of 2 things, 

1. They were reading/modifying the session state (via cookie or database calls).
2. They were making `fetch` calls to get data from the backend to the client. 

Now that Next.js components are **server first** by default, those `fetch` calls are no longer necessary and all session manipulation could be generalized and .... `[TODO]`. This allowed us to simplify our API surface significantly, to the point where we felt comfortable enough exposing all functionality via 1 export.

| Where                                     | Old                                                   | New                              |
| ----------------------------------------- | ----------------------------------------------------- | -------------------------------- |
| [Server Component](#server-component)     | `getServerSession(authOptions)`                       | `auth()` call                    |
| [Middleware](#middleware)                 | `withAuth(middleware, subset of authOptions)` wrapper | `auth` export / `auth()` wrapper |
| [Client Component](#client-component)     | `useSession()` hook                                   | `useSession()` hook              |
| [Route Handler](#route-handler)           | _Previously not supported_                            | `auth()` wrapper                 |
| [API Route (Edge)](#api-route-edge)       | _Previously not supported_                            | `auth()` wrapper                 |
| [API Route (Node)](#api-route-node)       | `getServerSession(req, res, authOptions)`             | `auth()` call                    |
| [getServerSideProps](#getserversideprops) | `getServerSession(ctx.req, ctx.res, authOptions)`     | `auth()` call                    |

## Breaking Changes

- OAuth 1.0 support is deprecated.
- The import `next-auth/next` is no longer available / needed.
- The import `next-auth/middleware` is no longer available / needed.
- The data returned from the `profile` callback from a provider used to have a field called `image` on it (i.e. `session.user.image`). To be more in line with the [OAuth spec](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims), we've renamed this to `picture`.
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

## API Route (Node)

Instead of importing `getServerSession` from `next-auth/next`, you can now import the `auth` function from your config file and call it without passing `authOptions`.

```diff title='pages/api/example.ts'
- import { authOptions } from 'pages/api/auth/[...nextauth]'
- import { getServerSession } from "next-auth/next"
+ import { auth } from "../auth"

export default async function handler(req, res) {
-  const session = await getServerSession(req, res, authOptions)
+  const session = await auth(req, res)
  if (session) return res.json('Success')
  return res.status(401).json("You must be logged in.");
}
```

## API Route (Edge)

## `getServerSideProps`

Instead of importing `getServerSession` from `next-auth/next`, you can now import the `auth` function from your config file and call it without passing `authOptions`.

To get the `session` server-side, we used to recommend calling `getServerSession` inside the `getServerSideProps` function, which would expose the `session` on the `props` passed to the component. Since components are server rendered by default now, you can grab the session directly in the body of the component with the same `auth` import.

```diff title="pages/protected.tsx"
- import { getServerSession } from "next-auth/next"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
+ import { auth } from "../auth"

export const getServerSideProps: GetServerSideProps = async (context) => {
-  const session = await getServerSession(context.req, context.res, authOptions)
+  const session = await auth(context)
  if (session) // Do something with the session

  return { props: { session } }
}
```

## Middleware

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

## Route Handler

## Server Component

Since Next.js 13+ now operates in a **server-first** model, our server components become the most common use-case and those have been significantly simplified as well. Again, we can use the same `auth` method as before to get the session inside the component.

<details><summary>Before Code</summary>

```ts title="pages/welcome.tsx"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"

export function Header({ props }) {
  return (
    <div>
      Welcome {props.session.user.name}!
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  return {
    props: {
      session,
    },
  }
}
```

</details>

<details><summary>After Code</summary>

```ts title="app/welcome/page.tsx"
import { auth } from "../../auth"

export default async function Page() {
  const session = await auth()
  return (
    <>
      <h1>NextAuth.js Example</h1>
      <p>Welcome {session.user.name}!</p>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://nextjs.authjs.dev">NextAuth.js</a> for authentication.
      </p>
    </>
  )
}
```

</details>

## Client Component

Imports from `next-auth/react` are now marked with the `"use client"` directive. [Read more](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive).

If you have previously used `getSession()` or other imports server-side, you'll have to change it to use the [`auth()](/reference/nextjs#auth) method instead.

`getCsrfToken` and `getProviders` are still available as imports, but we plan to deprecate them in the future and introduce a new API to get this data server-side.

Client side: Instead of using these APIs, you can make a fetch request to the `/api/auth/providers` and `/api/auth/csrf` endpoints respectively.
Server-side: TBD

## Database Migrations

NextAuth.js v5 does not introduce any breaking changes to the database schema. However, since OAuth 1.0 support is dropped, the already optional `oauth_token_secret` and `oauth_token` fields can be removed from the `account` table.

TODO: Mention that fields like GitHub's `refresh_token_expires_in` field need to be added in the `account()` callback if used.

## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
