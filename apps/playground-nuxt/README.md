> The example repository is maintained from a [monorepo](https://github.com/nextauthjs/next-auth/tree/main/apps/playground-nuxt). Pull Requests should be opened against [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth).

Nuxt 3 support with Auth.js is currently experimental. This directory contains a minimal, proof-of-concept application. Parts of this is expected to be abstracted away into a package like `@auth/nuxt`.

## Getting Started

1. Setup your environment variables in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  // https://v3.nuxtjs.org/migration/runtime-config#runtime-config
  runtimeConfig: {
    secret: process.env.NEXTAUTH_SECRET
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }
  }
})
```

2. Set up Auth.js options

Go to the API handler file (`server/api/auth/[...].ts`) and setup your providers. This file contains the dynamic route handler for Auth.js which will also contain all of your global Auth.js configurations.

Here's an example of what it looks like:

```ts
// server/api/auth/[...].ts

import { NuxtAuthHandler } from "@/lib/auth/server"
import GithubProvider from "@auth/core/providers/github"
import type { AuthOptions } from "@auth/core"

const runtimeConfig = useRuntimeConfig()

export const authOptions: AuthOptions = {
  secret: runtimeConfig.secret,
  providers: [
    GithubProvider({
      clientId: runtimeConfig.github.clientId,
      clientSecret: runtimeConfig.github.clientSecret,
    }),
  ],
}

export default NuxtAuthHandler(authOptions)
```

All requests to `/api/auth/*` (`signIn`, `callback`, `signOut`, etc.) will automatically be handled by Auth.js.
