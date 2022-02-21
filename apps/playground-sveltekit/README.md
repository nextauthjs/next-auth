# SvelteKit + NextAuth.js Playground

NextAuth.js is committed to bringing easy authentication to other frameworks. https://github.com/nextauthjs/next-auth/issues/2294

SvelteKit support with NextAuth.js is currently experimental. This directory contains a minimal, proof-of-concept application. Parts of this is expected to be abstracted away into a package like `@next-auth/sveltekit`

## Existing Project

### Add API route

To add NextAuth.js to a project create a file called `[...nextauth].js` in routes/api/auth. This contains the dynamic route handler for NextAuth.js which will also contain all of your global NextAuth.js configurations.

```ts
import NextAuth from "$lib"
import GithubProvider from "next-auth/providers/github"

const nextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
}

export const { get, post } = NextAuth(nextAuthOptions)
```

### Add [hook](https://kit.svelte.dev/docs/hooks)

```ts
import { getServerSession } from "$lib"
import GithubProvider from "next-auth/providers/github"

const nextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
    }),
  ],
}

export async function handle({ event, resolve }) {
  const session = await getServerSession(event.request, nextAuthOptions)
  event.locals.session = session

  return resolve(event)
}

export function getSession(event) {
  return event.locals.session || {}
}
```

### Protecting a route

```html
<script context="module">
  export async function load({ session }) {
    const { user } = session

    if (!user) {
      return {
        status: 302,
        redirect: "/",
      }
    }

    return {
      props: {
        session,
      },
    }
  }
</script>

<script>
  export let session
</script>

<p>Session expiry: {session.expires}</p>
```

## Packaging lib

Refer to https://kit.svelte.dev/docs/packaging
