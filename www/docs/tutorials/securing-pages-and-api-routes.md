---
id: securing-pages-and-api-routes
title: Securing pages and API routes
---

You can easily protect client and server side side rendered pages and API routes with NextAuth.js.

_You can find working examples of the approaches shown below in the [example project](https://github.com/iaincollins/next-auth-example/)._

## Securing Pages

### Client Side Pages

If data on a page is fetched using calls to API routes  - which in turn use getSession() or getToken() to access the session - you can use client side route protection using the `useSession` React Hook.

```js title="pages/client-side-example.js"
import { useSession, getSession } from 'next-auth/client'

export default () => {
  const [ session, loading ] = useSession()

  if (loading) { return <p>Loading…</p> }

  if (!loading && !session) { return <p>Access Denied</p> }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
    </>
  )
}
```

### Server Side Pages

You can use the NextAuth.js client method `getSession()` to protect server side rendered pages.

_You can also use the `getSession()` method client side (in which case it doesn't need any arguments)._

```js title="pages/server-side-example.js"
import { useSession, getSession } from 'next-auth/client'

export default () => {
  const [ session, loading ] = useSession()

  if (!session) { return <p>Access Denied</p> }

  return (
    <>
      <h1>Protected Page</h1>
      <p>You can view this page because you are signed in.</p>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)
  return {
    props: { session }
  }
}
```

:::tip
This example assumes you have configured `_app.js` to pass the `session` prop through so that it's immediately avalible on page load to `useSession`.

```js title="pages/_app.js"
import { Provider } from 'next-auth/client'

export default ({ Component, pageProps }) => {
  return (
    <Provider session={pageProps.session} >
      <Component {...pageProps} />
    </Provider>
  )
}
```
:::

## Securing API Routes

### Using getSession

You can use the NextAuth.js client method `getSession()` in API routes as well as on pages.

If a session is not found or has expired, it returns null.

```js title="pages/api/get-session-example.js"
import { getSession } from 'next-auth/client'

export default async (req, res) => {
  const session = await getSession({ req })
  console.log('Session', JSON.stringify(session, null, 2))
  if (session) {
    // Signed in
  } else {
    // Not signed in
  }
  res.end()
}
```

This is the recommended way to check if someone is signed in.

You can choose what data gets exposed in the public session using the [session callback](http://localhost:3000/configuration/callbacks#session).

### Using getToken

If you are using JSON Web Tokens you can use the `getToken` helper to access the contents of the JWT without having to handle JWT decryption / verification yourself - if either decryption or signature verification fails, or if the token is not found, `getToken()` returns null.

```js title="pages/api/get-token-example.js"
// This is an example of how to read a JSON Web Token from an API route
import jwt from 'next-auth/jwt'

const secret = process.env.SECRET

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret })
  console.log('JSON Web Token', JSON.stringify(token, null, 2))
  if (token) {
    // Signed in
  } else {
    // Not signed in
  }
  res.end()
}
```

:::tip
You can use this helper function in any application as long as you set the `NEXTAUTH_URL` environment variable and the application is able to read the JWT cookie (e.g. is running on the same domain).
:::

:::note
Pass `getToken` the same value for `secret` as specified in `pages/api/auth/[...nextauth].js`.

See [the documentation for the JWT option](http://localhost:3000/configuration/options#jwt) for more information.
:::
