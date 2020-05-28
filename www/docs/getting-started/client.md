---
id: client
title: Client
---

*The NextAuth.js client library makes it easy to interact with sessions from React applications.*

## Client API

### useSession()

The `useSession()` React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

It works best when used with NextAuth.js `<Provider>` is added to `pages/_app.js` (see [provider](#provider)).

```jsx
import NextAuth from 'next-auth/client'

export default () => {
  const [ session, loading ] = NextAuth.useSession()

  return <>
    {session && <p>Signed in as {session.user.email}</p>}
    {!session && <p><a href="/api/auth/signin">Sign in</p>}
  </>
}
```

### session()

NextAuth.js also provides a `session()` method which can be called client or server side to return a session.
 
It calls `/api/auth/session` and returns a promise with a session object, or null if no session exists.

```jsx title="/pages/index.js"
import { session } from 'next-auth/client'

const Page = ({ session }) => (<p>
    {!session && <>
      Not signed in <br/>
      <a href="/api/auth/signin">Sign in</a>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <a href="/api/auth/signout">Sign out</a>
    </>}
  </p>)

Page.getInitialProps = async (context) => {
  return {
    session: await session(context)
  }
}

export default Page
```

You can call `session()` inside a function to check if a user is signed in, or use it for server side rendered pages that supporting signing in without requiring client side JavaScript.

:::note
 The context object must be passed to **session()** when calling it server side.
:::


### Provider

Using the supplied React `<Provider>` allows instances of `useSession()` to share the session object across components, buy using [React Context](https://reactjs.org/docs/context.html) under the hood.

This improves performance, reduces network calls and avoids page flicker when rendering.

It is highly recommended and can be easily added to all pages in Next.js apps by using `/pages/_app.js`.
 
```jsx title="/pages/_app.js"
import { Provider } from 'next-auth/client'

export default ({ Component, pageProps }) => {
  const { session } = pageProps
  return (
    <Provider session={session}>
      <Component {...pageProps} />
    </Provider>
  )
}
```

If you pass the `session` page prop to the `<Provider>` – as in the example above – you can avoid checking the session twice on pages that support both server and client side rendering.

:::note
See [**the Next.js documentation**](https://nextjs.org/docs/advanced-features/custom-app) for more information on **_app.js** in Next.js applications.
:::
