---
id: example
title: Example Code
---

## Get started with NextAuth.js

The example code below describes how to add authentication to a Next.js app.

:::tip
The easiest way to get started is to clone the [example app](https://github.com/nextauthjs/next-auth-example) and follow the instructions in README.md. You can try out a live demo at [next-auth-example.vercel.app](https://next-auth-example.vercel.app)
:::

### Add API route

To add NextAuth.js to a project create a file called `[...nextauth].js` in `pages/api/auth`.

[Read more about how to add authentication providers.](/configuration/providers)

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
})
```

All requests to `/api/auth/*` (`signIn`, callback, `signOut`, etc.) will automatically be handled by NextAuth.js.

:::tip
See the [options documentation](/configuration/options) for how to configure providers, databases and other options.
:::

### Add React Hook

The [`useSession()`](http://localhost:3000/getting-started/client#usesession) React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

```javascript
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

:::tip
You can use the `useSession` hook from anywhere in your application (e.g. in a header component).
:::

### Share/configure session state

To be able to use `useSession` first you'll need to expose the session context, [`<SessionProvider />`](http://localhost:3000/getting-started/client#sessionprovider), at the top level of your application:

```javascript
// pages/_app.js
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

In this way instances of `useSession` can have access to the session data and status, otherwise they'll throw an error... `<SessionProvider />` also takes care of keeping the session updated and synced between browser tabs and windows.

:::tip
Check out the [client documentation](/getting-started/client) to see how you can improve the user experience and page performance by using the NextAuth.js client.
:::

### Deploying to production

When deploying your site set the `NEXTAUTH_URL` environment variable to the canonical URL of the website.

```
NEXTAUTH_URL=https://example.com
```

If you are using a URL for the API endpoints that is different than this (hence, a different folder structure as well), for example `NEXTAUTH_URL=https://example.com/api/v1/auth`, you also need to set a second environment variable with the key `NEXT_PUBLIC_NEXTAUTH_URL` and point it to the same URL. Otherwise, client side path detections will fail.

```
NEXTAUTH_URL=https://example.com/api/v1/auth
NEXT_PUBLIC_NEXTAUTH_URL=https://example.com/api/v1/auth
```

This assumes that `[...nextauth].js` is inside `/pages/api/v1/auth/`.

You can use a [Next.js feature](https://nextjs.org/docs/basic-features/environment-variables) to refer to environment variables by their names within the file.
```
NEXTAUTH_URL=https://example.com/api/v1/auth
NEXT_PUBLIC_NEXTAUTH_URL=$NEXTAUTH_URL
```

:::tip
In production, this needs to be set as an environment variable on the service you use to deploy your app.

To set environment variables on Vercel, you can use the [dashboard](https://vercel.com/dashboard) or the `vercel env pull` [command](https://vercel.com/docs/build-step#development-environment-variables).
:::
