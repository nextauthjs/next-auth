---
title: Securing Pages & API routes
---

You can easily protect client and server side rendered pages and API routes with Auth.js.

_You can find working examples of the approaches shown below in the [example project](https://github.com/nextauthjs/next-auth-example/)._

:::tip
The methods `getSession()` and `getToken()` both return an `object` if a session is valid and `null` if a session is invalid or has expired.
:::

## Securing Pages

### Client Side

If data on a page is fetched using calls to secure API routes - i.e. routes which use `getSession()` or `getToken()` to access the session - you can use the `useSession` React Hook to secure pages.

```js title="pages/client-side-example.js"
import { useSession, getSession } from "next-auth/react"

export default function Page() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
    </>
  )
}
```

### Next.js (Middleware)

With Auth.js 4.2.0 and Next.js 12, you can now protect your pages via the middleware pattern more easily. If you would like to protect all pages, you can create a `_middleware.js` file in your root `pages` directory which looks like this.

```js title="/middleware.js"
export { default } from "next-auth/middleware"
```

Otherwise, if you only want to protect a subset of pages, you could put it in a subdirectory as well, for example in `/pages/admin/_middleware.js` would protect all pages under `/admin`.

For the time being, the `withAuth` middleware only supports `"jwt"` as [session strategy](/reference/configuration/auth-config#session).

More details can be found [here](/reference/nextjs/#middleware).

### Server Side

You can protect server side rendered pages using the `unstable_getServerSession` method. This is different from the old `getSession()` method, in that it does not do an extra fetch out over the internet to confirm data from itself, increasing performance significantly.

You need to add this to every server rendered page you want to protect. Be aware, `unstable_getServerSession` takes slightly different arguments than the method it is replacing, `getSession`.

```js title="pages/server-side-example.js"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"
import { useSession } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession()

  if (typeof window === "undefined") return null

  if (session) {
    return (
      <>
        <h1>Protected Page</h1>
        <p>You can view this page because you are signed in.</p>
      </>
    )
  }
  return <p>Access Denied</p>
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      ),
    },
  }
}
```

:::tip
When you supply a `session` prop in `_app.js`, `useSession` won't show a loading state, as it'll already have the session available. In this way, you can provide a more seamless user experience.

```js title="pages/_app.js"
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

:::

## Securing API Routes

### Using unstable_getServerSession()

You can protect API routes using the `unstable_getServerSession()` method.

```js title="pages/api/get-session-example.js"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]"

export default async (req, res) => {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session) {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2))
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
```

### Using getToken()

If you are using JSON Web Tokens you can use the `getToken()` helper to access the contents of the JWT without having to handle JWT decryption / verification yourself. This method can only be used server side.

```js title="pages/api/get-token-example.js"
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"

export default async (req, res) => {
  // If you don't have NEXTAUTH_SECRET set, you will have to pass your secret as `secret` to `getToken`
  const token = await getToken({ req })
  if (token) {
    // Signed in
    console.log("JSON Web Token", JSON.stringify(token, null, 2))
  } else {
    // Not Signed in
    res.status(401)
  }
  res.end()
}
```

:::tip
You can use the `getToken()` helper function in any application as long as you set the `NEXTAUTH_URL` environment variable and the application is able to read the JWT cookie (e.g. is on the same domain).
:::

:::note
Pass `getToken` the same value for `secret` as specified in `pages/api/auth/[...nextauth].js`.

See [the documentation for the JWT option](/reference/configuration/auth-config#jwt) for more information.
:::
