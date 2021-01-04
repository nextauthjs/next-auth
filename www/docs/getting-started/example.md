---
id: example
title: Example Code
---

## Get started with NextAuth.js

The example code below describes to add authentication to a Next.js app.

:::tip
The easiest way to get started is to clone the [example app](https://github.com/iaincollins/next-auth-example) and follow the instructions in README.md. You can try out a live demo at [next-auth-example.now.sh](https://next-auth-example.now.sh)
:::

### Add API route

To add NextAuth.js to a project create a file called `[...nextauth].js` in `pages/api/auth`.

[Read more about how to add authentication providers.](/configuration/providers)

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
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
})
```

All requests to `/api/auth/*` (signin, callback, signout, etc) will automatically be handed by NextAuth.js.

:::tip
See the [options documentation](/configuration/options) for how to configure providers, databases and other options.
:::

### Add React Hook

The `useSession()` React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

```jsx title="pages/index.js"
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page() {
  const [ session, loading ] = useSession()

  return <>
    {!session && <>
      Not signed in <br/>
      <button onClick={() => signIn()}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>}
  </>
}
```

:::tip
You can use the `useSession` hook from anywhere in your application (e.g. in a header component).
:::

### Add session state

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

### Deploying to production

When deploying your site set the `NEXTAUTH_URL` environment variable to the canonical URL of the website.

```
NEXTAUTH_URL=https://example.com
```

:::tip
In production, this needs to be set as an environment variable on the service you use to deploy your app.

To set environment variables on Vercel, you can use the [dashboard](https://vercel.com/dashboard) or the `vercel env pull` [command](https://vercel.com/docs/build-step#development-environment-variables).
:::
