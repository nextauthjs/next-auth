---
id: example
title: Example
---

### Check out the example project

The easiest way to get started is to clone the [example application](https://github.com/iaincollins/next-auth-example) and follow the instructions in the [README](https://github.com/iaincollins/next-auth-example/blob/main/README.md).

You can find a live demo of the example project at [next-auth-example.now.sh](https://next-auth-example.now.sh)

## Add to an existing project

*The example code below shows how to add authentication to an existing Next.js project.*

### Add API route

To add NextAuth.js to a project create a file called `[...nextauth].js` in `pages/api/auth`.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    // ...add more providers here
  ],

  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL,
}

export default (req, res) => NextAuth(req, res, options)
```

All requests to `/api/auth/*` (signin, callback, signout, etc) will automatically be handed by NextAuth.js.

:::tip
See the [options documentation](/configuration/options) for how to configure providers, databases and other options.
:::

### Add React Hook

The `useSession()` React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

```jsx title="pages/index.js"
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page() {
  const [ session, loading ] = useSession()

  return <>
    {!session && <>
      Not signed in <br/>
      <button onClick={signIn}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={signOut}>Sign out</button>
    </>}
  </>
}
```

***That's all the code you need to add authentication with NextAuth.js to a project!***

:::tip
You can use the `useSession` hook from anywhere in your application (e.g. in a header component).
:::

### Add to all pages

To allow session state to be shared between pages - which improves performance, reduces network traffic and avoids component state changes while rendering - you can use the NextAuth.js Provider in `pages/_app.js`.

```jsx title="pages/_app.js"
import { Provider } from 'next-auth/client'

export default function App ({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}
```

:::tip
Check out the [client documentation](/getting-started/client) to see how you can improve the user experience and page performance by using the NextAuth.js client.
:::

### Deploying

When deploying your site set the `NEXTAUTH_URL` environment variable to the canonical URL of the website.

```
NEXTAUTH_URL=https://example.com
```

:::tip
To set environment variables on Vercel, you can use the [dashboard](https://vercel.com/dashboard) or the `now env` command.
:::
