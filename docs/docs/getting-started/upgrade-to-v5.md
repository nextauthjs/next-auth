---
title: Upgrade Guide (v5)
---

NextAuth.js version 5 will continue to be shipped as `next-auth` **for the Next.js version only**. We're here to help you upgrade your applications as smoothly as possible. It is possible to upgrade from any version of 4.x to the latest v5 release by following the  migration steps below.

Upgrade to the latest version by running:

```bash npm2yarn2pnpm
npm install next-auth@latest
```

## Getting Started

Below is a summary of the high-level API changes in `next-auth` v5. Most of these methods were doing 1 of 2 things, 

1. They were reading/modifying the session state (via cookie or database calls).
2. They were making `fetch` calls to get data from the backend to the client. 

Now that Next.js components are **server first** by default, those `fetch` calls are no longer necessary and all session manipulation could be generalized and .... `[TODO]`. This allowed us to simplify our API surface significantly, to the point where we felt comfortable enough exposing all functionality via 1 export.

| Where                                     | Old                                                   | New              |
| ----------------------------------------- | ----------------------------------------------------- | ---------------- |
| [API Route (Node)](#api-route-node)       | `getServerSession(req, res, authOptions)`             | `auth()` call    |
| [API Route (Edge)](#api-route-edge)       | -                                                     | `auth()` wrapper |
| [getServerSideProps](#getserversideprops) | `getServerSession(ctx.req, ctx.res, authOptions)`     | `auth()` call    |
| [Middleware](#middleware)                 | `withAuth(middleware, subset of authOptions)` wrapper | `auth()` wrapper |
| [Route Handler](#route-handler)           | -                                                     | `auth()` wrapper |
| [Server Component](#server-component)     | `getServerSession(authOptions)`                       | `auth()` call    |
| [Client Component](#client-component)     | `useSession()` hook                                   | `useAuth()` hook |


## Breaking Changes

- The import `next-auth/next` is no longer available.
- The import `next-auth/middleware` is no longer available.
- The data returned from the `profile` callback from a provider used to have a field called `image` on it (i.e. `session.user.image`). To be more in line with the [OAuth spec](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims), we've renamed this to `picture`.
- If you are using a **database adapter** and passing it additional fields from your provider, the default behaviour has changed. We used to automatically pass on all fields from the provider to the adapter. **We no longer pass on all returned fields from your provider(s) to the adapter by default**. You must manually pass on your chosen fields in the provider's `account` callback. See: [AccountCallback docs](#).

## Configuration File

We worked hard to avoid having to save your config options in a separate file and then pass them around as `AuthOptions` throughout your application. To achieve this, we settled on moving the configuration file to the root of the repository and having it export an `auth` function you can use everywhere else. There is no required magic name, however, we recommend naming it `auth.ts`.

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
// import { auth } from './auth'
import { auth } from 'auth'
```

The old configuration file, contained in the API Route (`pages/api/auth/[...nextauth].ts`), now becomes a simple 3-line handler for `GET` and `POST` requests for those paths.

```ts title="app/api/auth/[...nextauth]/route.tsx"
import { handlers } from "./auth"
export const { GET, POST } = handlers
export const runtime = "edge"
```

## API Route (Node)

The `auth` import can now be used to simply wrap your App Router API Route. This will expose an `auth` object on your `req` argument. See the example below:


<details><summary>Before Code</summary>

```ts title='pages/api/example.js'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"


export async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  return res.json({
    message: 'Success',
  })
}
```

</details>

<details><summary>After Code</summary>

```ts title='app/example/route.ts'
import { auth } from "./auth"
import { NextResponse } from "next/server"

export const GET = auth(function GET(req) {
  if (req.auth) {
    return NextResponse.json(req.auth)
  }

  return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})
```

</details>

## API Route (Edge)

## `getServerSideProps`

To get the `session` server-side, we used to recommend calling `getServerSession` inside the `getServerSideProps` function, which would expose the `session` on the `props` passed to the component. Since components are server rendered by default now, you can grab the session directly in the body of the component with the same `auth` import.

```ts title="app/welcome/page.tsx"
import { auth } from "../../auth"

export default async function Page() {
  const session = await auth()
  return (
    <>
      <p>Welcome {session?.user.name}!</p>
    </>
  )
}
```

## Middleware

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

Imports from `next-auth/react` are marked with the `"use client"` directive. [Read more](https://nextjs.org/docs/getting-started/react-essentials#the-use-client-directive).

If you have previously used `getSession()` server-side, you'll have to change it to use the [`auth()](/reference/nextjs#auth) method instead.

TODO: Add diff example

## Database Migrations

NextAuth.js v5 does not introduce any breaking changes to the database schema. However, since OAuth 1.0 support is dropped, the already optional `oauth_token_secret` and `oauth_token` fields can be removed from the `account` table.

TODO: Mention that fields like GitHub's `refresh_token_expires_in` field need to be added in the `account()` callback if used.

## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
