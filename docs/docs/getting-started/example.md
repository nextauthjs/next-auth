---
id: example
title: Getting Started
---

The example code below describes how to add authentication to a Next.js app.

## New Project

The easiest way to get started is to clone the [example app](https://github.com/nextauthjs/next-auth-example) and follow the instructions in README.md. You can try out a live demo at [https://next-auth-example.vercel.app/](https://next-auth-example.vercel.app/)

## Existing Project

### Add API route

To add NextAuth.js to a project create a file called `[...nextauth].js` in `pages/api/auth`. This contains the dynamic route handler for NextAuth.js which will also contain all of your global NextAuth.js configurations.

```javascript title="pages/api/auth/[...nextauth].js" showLineNumbers
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
})
```

All requests to `/api/auth/*` (`signIn`, `callback`, `signOut`, etc.) will automatically be handled by NextAuth.js.

**Further Reading**:

- See the [options documentation](/configuration/options) for more details on how to configure providers, databases and other options.
- Read more about how to add authentication providers [here](/providers).

#### Configure Shared session state

To be able to use `useSession` first you'll need to expose the session context, [`<SessionProvider />`](/getting-started/client#sessionprovider), at the top level of your application:

```jsx title="pages/_app.jsx" showLineNumbers
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

Instances of `useSession` will then have access to the session data and status. The `<SessionProvider />` also takes care of keeping the session updated and synced between browser tabs and windows.

:::tip
Check out the [client documentation](/getting-started/client) to see how you can improve the user experience and page performance by using the NextAuth.js client.
:::

### Frontend - Add React Hook

The [`useSession()`](/getting-started/client#usesession) React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

```jsx title="components/login-btn.jsx" showLineNumbers
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

You can use the `useSession` hook from anywhere in your application (e.g. in a header component).

### Backend - API Route

To protect an API Route, you can use the [`getSession()`](/getting-started/client#getsession) method in the NextAuth.js client.

```javascript title="pages/api/restricted.js" showLineNumbers
import { getSession } from "next-auth/react"

export default async (req, res) => {
  const session = await getSession({ req })

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    res.send({
      error: "You must be sign in to view the protected content on this page.",
    })
  }
}
```

### Extensibility

#### Using NextAuth.js Callbacks

NextAuth.js allows you to hook into various parts of the authentication flow via our [built-in callbacks](/configuration/callbacks).

For example, to pass a value from the sign-in to the frontend, client-side, you can use a combination of the [`session`](/configuration/callbacks#session-callback) and [`jwt`](/configuration/callbacks#jwt-callback) callback like so:

```javascript title="pages/api/auth/[...nextauth].js"
...
callbacks: {
  async jwt({ token, account }) {
    // Persist the OAuth access_token to the token right after signin
    if (account) {
    // highlight-next-line
      token.accessToken = account.access_token
    }
    return token
  },
  async session({ session, token, user }) {
    // Send properties to the client, like an access_token from a provider.
    // highlight-next-line
    session.accessToken = token.accessToken
    return session
  }
}
...
```

Now whenever you call `getSession` or `useSession`, the data object which is returned will include the `accessToken` value.

```jsx title="components/accessToken.jsx" showLineNumbers
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  // highlight-next-line
  const { data } = useSession()
  const { accessToken } = data

  return <div>Access Token: {accessToken}</div>
}
```

## Configuring callback URL (OAuth only)

If you are using an OAuth provider either through one of our [built-in providers](/configuration/providers/oauth)
or through a [custom provider](/configuration/providers/oauth#using-a-custom-provider), you'll need to configure
a callback URL in your provider's settings. Each provider has a "Configuration" section that should give you pointers on how to do that.

Follow [these steps](/configuration/providers/oauth#how-to) to learn how to integrate with an OAuth provider.

## Deploying to production

When deploying your site set the `NEXTAUTH_URL` environment variable to the canonical URL of the website.

```
NEXTAUTH_URL=https://example.com
```

:::tip
In production, this needs to be set as an environment variable on the service you use to deploy your app.

To set environment variables on Vercel, you can use the [dashboard](https://vercel.com/dashboard) or the `vercel env pull` [command](https://vercel.com/docs/build-step#development-environment-variables).
:::

For more information please check out our [deployment page](/deployment).
