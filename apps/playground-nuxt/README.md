# NextAuth + Nuxt 3 Playground

NextAuth.js is committed to bringing easy authentication to other frameworks. [#2294](https://github.com/nextauthjs/next-auth/issues/2294)

Nuxt 3 support with NextAuth.js is currently experimental. This directory contains a minimal, proof-of-concept application. Parts of this is expected to be abstracted away into a package like` @next-auth/nuxt.`

This package uses Nuxt's [module starter](https://github.com/nuxt/starter/tree/module).

Demo: https://next-auth-nuxt-demo.vercel.app

## Getting Started

### Add the module to the modules section of `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  // temporary module name.
  modules: ['next-auth-nuxt'],
  // https://v3.nuxtjs.org/migration/runtime-config#runtime-config
  runtimeConfig: {
    secret: process.env.NEXTAUTH_SECRET
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  },
  // https://v3.nuxtjs.org/guide/concepts/esm#aliasing-libraries
  // Fix for GithubProvider (or whichever provider you choose) is not a function error in Vite
  alias: {
    'next-auth/providers/github': 'node_modules/next-auth/providers/github.js'
  }
})
```

### Add API route

To add `NextAuth.js` to a project create a file called `[...].ts` in `server/api/auth`. This contains the dynamic route handler for NextAuth.js which will also contain all of your global NextAuth.js configurations.

```ts
// ~/server/api/auth/[...].ts
import { NextAuthNuxtHandler } from 'next-auth-nuxt/handler'
import GithubProvider from 'next-auth/providers/github'

const runtimeConfig = useRuntimeConfig()

export const authOptions = {
  secret: runtimeConfig.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret
    }),
  ],
}

export default NextAuthNuxtHandler(authOptions)
```

All requests to `/api/auth/*` (`signIn`, `callback`, `signOut`, etc.) will automatically be handled by NextAuth.js.

### Frontend - Add Vue Composable

The `useSession()` Vue Composable is the easiest way to check if someone is signed in.

```html
<script setup lang="ts">
const { data: session } = useSession()
</script>

<template>
  <div v-if="session">
    Signed in as {{ session.user.email }} <br />
    <button @click="signOut">Sign out</button>
  </div>
  <div v-else>
    Not signed in <br />
    <button @click="signIn">Sign in</button>
  </div>
</template>
```

### Backend - API Route

To protect an API Route, you can use the `getServerSession()` method.

```ts
import { getServerSession } from 'next-auth-nuxt/handler'
import { authOptions } from '~/server/api/auth/[...]'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event, authOptions)

  if (session) {
    return {
      content: 'This is protected content. You can access this content because you are signed in.'
    }
  }

  return {
    error: 'You must be signed in to view the protected content on this page.'
  }
})
```

## Development

- Run `pnpm dev:generate` to generate type stubs.
- Use `pnpm dev` to start `playground` in development mode.
