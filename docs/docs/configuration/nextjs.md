# Next.js

## Middleware

You can use a Next.js Middleware with NextAuth.js to protect your site.

Next.js 12 has introduced [Middleware](https://nextjs.org/docs/middleware). It is a way to run logic before accessing any page, even when they are static. On platforms like Vercel, Middleware is run at the [Edge](https://nextjs.org/docs/api-reference/edge-runtime).

If the following options look familiar, this is because they are a subset of [these options](/configuration/options#options). You can extract these to a common configuration object to reuse them. In the future, we would like to be able to run everything in Middleware. (See [Caveats](#caveats)).

You can get the `withAuth` middleware function from `next-auth/middleware` either as a default or a named import:

### Prerequisites

You must set the [`NEXTAUTH_SECRET`](/configuration/options#nextauth_secret) environment variable when using this middleware. If you are using the [`secret` option](/configuration/options#secret) this value must match.

**We strongly recommend** replacing the `secret` value completely with this `NEXTAUTH_SECRET` environment variable. This environment variable will be picked up by both the [NextAuth config](/configuration/options#options), as well as the middleware config.

---

```js
import withAuth from "next-auth/middleware"
// or
import { withAuth } from "next-auth/middleware"
```

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

#### Example (default value)

```js
pages: {
  signIn: '/auth/signin',
  error: '/auth/error',
}
```

See the documentation for the [pages option](/configuration/pages) for more information.

---

### Examples

`withAuth` is very flexible, there are multiple ways to use it.

:::note
If you do not define the options, NextAuth.js will use the default values for the omitted options.
:::

#### default re-export

```js title="pages/_middleware.js"
export { default } from "next-auth/middleware"
```

With this one line, when someone tries to load any of your pages, they will have to be logged-in first. Otherwise, they are redirected to the login page. It will assume that you are using the `NEXTAUTH_SECRET` environment variable.

#### default `withAuth` export

```js title="pages/admin/_middleware.js"
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "admin"
  }
})
```

With the above code, you just made sure that only user's with the `admin` role can access any of the pages under thge `/admin` route. (Including nested routes as well, like `/admin/settings` etc.).

#### wrap middleware

```ts title="pages/admin/_middleware.ts"
import type { NextRequest } from "next/server"
import type { JWT } from "next-auth/jwt"

import { withAuth } from "next-auth/middleware"

export default withAuth(function middleware(req: NextRequest & { nextauth: { token: JWT } }) {
  console.log(req.nextauth.token)
}, {
  callbacks: {
    authorized: ({ token }) => token?.role === "admin"
  }
})
```

The `middleware` function will only be invoked if the `authorized` callback returns `true`.

---

### Caveats

- Currently only supports session verification, as parts of the sign-in code need to run in a Node.js environment. In the future, we would like to make sure that NextAuth.js can fully run at the [Edge](https://nextjs.org/docs/api-reference/edge-runtime)
- Only supports the `"jwt"` [session strategy](/configuration/options#session). We need to wait until databases at the Edge become mature enough to ensure a fast experience. (If you know of an Edge-compatible database, we would like if you proposed a new [Adapter](/tutorials/creating-a-database-adapter))
