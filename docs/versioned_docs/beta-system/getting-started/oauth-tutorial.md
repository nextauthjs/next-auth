---
id: oauth-tutorial
title: OAuth authentication
---

We know, authentication is hard. Is a rabbit hole and it's easy to get lost on it. NextAuth exists so that you can add authentication easily to your project with just a few lines of code.

The easiest way is to setup NextAuth with an [OAuth](https://en.wikipedia.org/wiki/OAuth) provider. In this tutorial we'll be setting NextAuth in a **NextJS app** to be able to login with **Github**.

:::info
NextAuth comes with a long list of [built-in providers](/reference/Providers/) (Google, Facebook, Twitter, etc...) you can also integrate it with your own OAuth service easily by [building a custom provider](/guides/oauth/custom-provider).<br /> NextAuth can integrate as well with other Front-end frameworks like SvelteKit and Gatsby.
:::

## 1. Configuring NextAuth

### Creating the server config

To add NextAuth to a [**NextJS**](https://nextjs.org/) project, create the following [API route](https://nextjs.org/docs/api-routes/introduction):

```
pages/api/auth/[...nextauth].ts
```

This route will contain the **dynamic route handler** for NextAuth which describes your global auth configuration:

```ts title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
})
```

Behind the scenes this creates all the relevant API routes within `/api/auth/*` so that auth API requests to:

- `/api/auth/callback`
- `/api/auth/signIn`
- `/api/auth/singOut`
- etc...

can be handled by NextAuth. In this way, NextAuth can handle the whole auth request/response flow of your app.

You may notice there are some environment variables in the code example above. `GITHUB_ID` and `GITHUB_SECRET` are provided by the OAuth provider (in this case **Github**) see ["Configuring OAuth Provider"](/getting-started/oauth-tutorial#2-configuring-oauth-provider) section on how to get those.

`NEXTAUTH_SECRET` is a random string used by the library to encrypt tokens and email verification hashes, and **it's mandatory to keep things secure**! 🔥 ⚠️ . You can use:

```
$ openssl rand -base64 32
```

or https://generate-secret.vercel.app/32 to generate a random value for it.

:::info
NextAuth is extremely customizable, [our guides section](/guides/overview) will teach you how you can set it up to handle auth in different ways. All the possible configuration options are [listed here](/reference/server/configuration).
:::

### Exposing the session via provider

To be able to use `useSession` first you'll need to expose the session context, [`<SessionProvider />`](/getting-started/client#sessionprovider), at the top level of your application:

```ts title="pages/_app.ts"
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

Instances of `useSession` will then have access to the session data and status. The `<SessionProvider />` also takes care of keeping the session updated and synced between browser tabs and windows. 💪🏽

:::tip
Check our [client docs](/reference/client/introduction) to learn all the available options for handling sessions on the browser.
:::

### Consuming the session via hooks

NextAuth exposes a [`useSession()`](/getting-started/client#usesession) React Hook so that you can easily check if someone is signed in:

```ts title="pages/overview.tsx"
import { useSession, signIn, signOut } from "next-auth/react"

export default function MoviesPage() {
  const { data: session, status } = useSession()
  const userEmail = session.user.email

  if (status === "loading") {
    return <p>Hang on there...</p>
  }

  if (status === "authenticated") {
    return (
      <>
        <p>Signed in as {userEmail}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }

  return (
    <>
      <p>Not signed in.</p>
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

You can use the `useSession` hook from anywhere in your application (e.g. in a header component). Behind the scenes, the hook will connect to the `<SessionProvider />` to read the current user session.

### Protecting API Routes

Protecting your custom API Routes (.i.e not allowing a resource to be accessed in case the user is not logged in) is easy! You can use [`getSession()`](/getting-started/client#getsession) to know whether a session exists or not:

```ts title="pages/api/movies/list.ts"
import { getSession } from "next-auth/react"

export default async function listMovies(req, res) {
  const session = await getSession({ req })

  if (session) {
    res.send({
      movies: [
        { title: "Alien vs Predator", id: 1 },
        { title: "Reservoir Dogs", id: 2 },
      ],
    })
  } else {
    res.send({
      error: "You must sign in to view movies.",
    })
  }
}
```

## 2. Configuring OAuth Provider

Ok, we have our NextJS app setup with NextAuth, however, if you run the app right now, it won't work as we haven't configured our OAuth provider (**Github**) yet.

:::info
When using OAuth you're asking for a third-party service (in this case Github, although it could be Google, Twitter, etc...) to handle user authentication for your app.
:::

We need to register our new NextJS app in Github, so that when NextAuth forwards the authorization requests to it, Github can recognize your application and prompt the user to sign in.

<img src="/img/getting-started/github-oauth-apps.png" />

Log in into **Github**, go to `Settings / Developers / OAuth Apps` and click on "New OAuth App".

## 3. Wiring all together

...

## 4. Deploying to production

When deploying your site set the `NEXTAUTH_URL` environment variable to the canonical URL of the website.

```
NEXTAUTH_URL=https://example.com
```

:::tip
In production, this needs to be set as an environment variable on the service you use to deploy your app.

To set environment variables on Vercel, you can use the [dashboard](https://vercel.com/dashboard) or the `vercel env pull` [command](https://vercel.com/docs/build-step#development-environment-variables).
:::

For more information please check out our [deployment page](/deployment).
