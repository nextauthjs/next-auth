---
id: client
title: Client
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`NextAuth` comes with client library as helper for calling the API endpoints on the front end.

### session()

Returns the session object, or null if no session.

Universal, can be used both client and server side. Use with `await`.

When calling server side (e.g. from `getInitialProps`) you need to pass the `req` object

e.g. `const session = await NextAuthClient.session({req})`

### useSession()

Client side only React hook. Works best when used with NextAuth.Provider

```jsx
import NextAuth from 'next-auth'

export default () => {
  const [ session, loading ] = NextAuth.useSession()

  return <>
    {session && <p>Signed in as {session.user.email}</p>}
    {!session && <p><a href="/api/auth/signin">Sign in</p>}
  </>
}
```
### Provider

Allows instances of `useSession()` to share context and to inherit `session` object from page props if rendering server side. Improves performance, reduces network calls and avoids page flicker when rendering.

```jsx title="/pages/_app_.js"
import NextAuth from 'next-auth'

export default ({ Component, pageProps }) => (
  <NextAuth.Provider>
    <Component {...pageProps} />
  </NextAuth.Provider>
)
```