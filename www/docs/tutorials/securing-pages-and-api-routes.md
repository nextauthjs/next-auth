---
id: securing-pages-and-api-routes
title: Securing pages and API routes
---

You can easily protect client and server side rendered pages and API routes with NextAuth.js.

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

### Server Side

You can protect server side rendered pages using the `getSession()` method.

```js title="pages/server-side-example.js"
import { useSession, getSession } from "next-auth/react"

export default function Page() {
  const { data: session } = useSession()

  if (typeof window !== "undefined") return null

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
      session: await getSession(context)
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
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session} >
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

:::

## Securing API Routes

### Using getSession()

You can protect API routes using the `getSession()` method.

```js title="pages/api/get-session-example.js"
import { getSession } from "next-auth/react"

export default async (req, res) => {
  const session = await getSession({ req })
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

const secret = process.env.SECRET

export default async (req, res) => {
  const token = await getToken({ req, secret })
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

See [the documentation for the JWT option](/configuration/options#jwt) for more information.
:::
