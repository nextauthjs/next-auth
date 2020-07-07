---
id: example
title: Example
---

## Example project

The easiest way to get started is to clone the example Next.js application from the [next-auth-example](https://github.com/iaincollins/next-auth-example) repository and to the instructions in the [README](https://github.com/iaincollins/next-auth-example/blob/main/README.md).

You can find a live demo of the example project at [next-auth-example.now.sh](https://next-auth-example.now.sh)

## Adding NextAuth.js to an existing project

*The examples code below shows how to add authentication with NextAuth.js to an existing Next.js project.*

### Add API route

To add NextAuth.js to a project, first create a file called `[...nextauth].js` in `pages/api/auth`.

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
import {
  signIn, 
  signOut,
  useSession
} from 'next-auth/client'

export default () => {
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

*That's all the code you need to add authentication to a project!*

### Configuration

When deploying to production, set the `NEXTAUTH_URL` environment variable to the canonical URL of your site.

#### Example

```
NEXTAUTH_URL=https://example.com
```

This configuration option is handled using an environment variable to make it easy to access sessions from any API route or server rendered page in your application.

:::tip
Check out the [client documentation](/getting-started/client) to see how you can improve the user experience and page performance by using the NextAuth.js client.
:::
