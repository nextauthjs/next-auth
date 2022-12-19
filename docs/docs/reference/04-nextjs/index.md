---
title: Next.js
---

## `unstable_getServerSession`

:::warning
This feature is experimental and may be removed or changed in the future.
:::

When calling from server-side i.e. in API routes or in `getServerSideProps`, we recommend using this function instead of `getSession` to retrieve the `session` object. This method is especially useful when you are using Auth.js with a database. This method can _drastically_ reduce response time when used over `getSession` server-side, due to avoiding an extra `fetch` to an API Route (this is generally [not recommended in Next.js](https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props#getserversideprops-or-api-routes)). In addition, `unstable_getServerSession` will correctly update the cookie expiry time and update the session content if `callbacks.jwt` or `callbacks.session` changed something.

Otherwise, if you only want to get the session token, see [`getToken`](/guides/basics/securing-pages-and-api-routes#using-gettoken).

`unstable_getServerSession` requires passing the same object you would pass to `NextAuth` when initializing Auth.js. To do so, you can export your Auth.js options in the following way:

In `[...nextauth].ts`:

```ts
import { NextAuth } from "next-auth"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  // your configs
}

export default NextAuth(authOptions)
```

### In `getServerSideProps`:

```js
import { authOptions } from "pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}
```

### In API Routes:

```js
import { authOptions } from "pages/api/auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

export async function handler(req, res) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." })
    return
  }

  return res.json({
    message: "Success",
  })
}
```

### In `app/` directory:

You can also use `unstable_getServerSession` in Next.js' server components:

```tsx
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "pages/api/auth/[...nextauth]"

export default async function Page() {
  const session = await unstable_getServerSession(authOptions)
  return <pre>{JSON.stringify(session, null, 2)}</pre>
}
```

:::warning
Currently, the underlying Next.js `cookies()` method does [only provides read access](/reference/configuration/auth-config#cookies) to the request cookies. This means that the `expires` value is stripped away from `session` in Server Components. Furthermore, there is a hard expiry on sessions, after which the user will be required to sign in again. (The default expiry is 30 days).
:::

## Middleware

You can use a Next.js Middleware with Auth.js to protect your site.

Next.js 12 has introduced [Middleware](https://nextjs.org/docs/middleware). It is a way to run logic before accessing any page, even when they are static. On platforms like Vercel, Middleware is run at the [Edge](https://nextjs.org/docs/api-reference/edge-runtime).

If the following options look familiar, this is because they are a subset of [these options](/reference/configuration/auth-config). You can extract these to a common configuration object to reuse them. In the future, we would like to be able to run everything in Middleware. (See [Caveats](#caveats)).

You can get the `withAuth` middleware function from `next-auth/middleware` either as a default or a named import:

### Prerequisites

You must set the same secret in the middleware that you use in NextAuth. The easiest way is to set the [`NEXTAUTH_SECRET`](/reference/configuration/auth-config#nextauth_secret) environment variable. It will be picked up by both the [Auth.js config](/reference/configuration/auth-config), as well as the middleware config.

Alternatively, you can provide the secret using the [`secret`](#secret) option in the middleware config.

**We strongly recommend** replacing the `secret` value completely with this `NEXTAUTH_SECRET` environment variable.

### Basic usage

The most simple usage is when you want to require authentication for your entire site. You can add a `middleware.js` file with the following:

```js
export { default } from "next-auth/middleware"
```

That's it! Your application is now secured. 🎉

If you only want to secure certain pages, export a `config` object with a `matcher`:

```js
export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard"] }
```

Now you will still be able to visit every page, but only `/dashboard` will require authentication.

If a user is not logged in, the default behavior is to redirect them to the sign-in page.

---

### `callbacks`

- **Required:** No

#### Description

Callbacks are asynchronous functions you can use to control what happens when an action is performed.

#### Example (default value)

```js
 callbacks: {
   authorized({ req , token }) {
     if(token) return true // If there is a token, the user is authenticated
   }
 }
```

---

### `pages`

- **Required**: _No_

#### Description

Specify URLs to be used if you want to create custom sign in, and error pages. Pages specified will override the corresponding built-in page.

:::note
This should match the `pages` configuration that's found in `[...nextauth].ts`.
:::

#### Example (default value)

```js
pages: {
  signIn: '/api/auth/signin',
  error: '/api/auth/error',
}
```

See the documentation for the [`pages` option](/reference/configuration/auth-config#pages) for more information.

---

### `secret`

- **Required**: _No_

#### Description

The same `secret` used in the [Auth.js config](/reference/configuration/auth-config).

#### Example (default value)

```js
secret: process.env.NEXTAUTH_SECRET
```

---

### Advanced usage

Auth.js Middleware is very flexible, there are multiple ways to use it.

:::note
If you do not define the options, Auth.js will use the default values for the omitted options.
:::

#### wrap middleware

```ts title="middleware.ts"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log(req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === "admin",
    },
  }
)

export const config = { matcher: ["/admin"] }
```

The `middleware` function will only be invoked if the `authorized` callback returns `true`.

---

#### Custom JWT decode method

If you have a custom jwt decode method set in `[...nextauth].ts`, you must also pass the same `decode` method to `withAuth` in order to read the custom-signed JWT correctly. You may want to extract the encode/decode logic to a separate function for consistency.

```ts title="/api/auth/[...nextauth].ts"
import type { NextAuthOptions } from "next-auth"
import NextAuth from "next-auth"
import jwt from "jsonwebtoken"

export const authOptions: NextAuthOptions = {
  providers: [...],
  jwt: {
    async encode({ secret, token }) {
      return jwt.sign(token, secret)
    },
    async decode({ secret, token }) {
      return jwt.verify(token, secret)
    },
  },
}

export default NextAuth(authOptions)
```

And:

```ts title="middleware.ts"
import withAuth from "next-auth/middleware"
import { authOptions } from "pages/api/auth/[...nextauth]"

export default withAuth({
  jwt: { decode: authOptions.jwt },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})
```

### Caveats

- Currently only supports session verification, as parts of the sign-in code need to run in a Node.js environment. In the future, we would like to make sure that Auth.js can fully run at the [Edge](https://nextjs.org/docs/api-reference/edge-runtime)
- Only supports the `"jwt"` [session strategy](/reference/configuration/auth-config#session). We need to wait until databases at the Edge become mature enough to ensure a fast experience. (If you know of an Edge-compatible database, we would like if [you proposed a new Adapter](/guides/adapters/creating-a-database-adapter))
