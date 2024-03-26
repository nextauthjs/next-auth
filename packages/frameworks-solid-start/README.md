<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img width="150px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>
   <h3 align="center">Solid-Start Auth</a></h3>
   <h4 align="center">Authentication for Solid-Start.</h4>
   <p align="center" style="align: center;">
      <a href="https://npm.im/next-auth">
        <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
      </a>
      <a href="https://npm.im/@auth/solid-start">
        <img alt="npm" src="https://img.shields.io/npm/v/@auth/solid-start?color=green&label=@auth/solid-start&style=flat-square">
      </a>
      <a href="https://www.npmtrends.com/@auth/solid-start">
        <img src="https://img.shields.io/npm/dm/@auth/solid-start?label=%20downloads&style=flat-square" alt="Downloads" />
      </a>
      <a href="https://github.com/nextauthjs/next-auth/stargazers">
        <img src="https://img.shields.io/github/stars/nextauthjs/next-auth?style=flat-square" alt="Github Stars" />
      </a>
   </p>
</p>

---

Check out the documentation at [solid-start.authjs.dev](https://solid-start.authjs.dev).

# Getting started

```bash
npm install @auth/solid-start@latest
```

## Setting It Up

[Generate auth secret](https://generate-secret.vercel.app/32), then set it as an environment variable:

```
AUTH_SECRET=your_auth_secret
```

### On Production

If you're 

```
AUTH_TRUST_HOST=true
```

## Creating the api handler

in this example we are using github so make sure to set the following environment variables:

```
GITHUB_ID=your_github_oauth_id
GITHUB_SECRET=your_github_oauth_secret
```

```ts
// routes/api/auth/[...solidauth].ts
import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start"
import GitHub from "@auth/core/providers/github"

export const authOpts: SolidAuthConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  debug: false,
}

export const { GET, POST } = SolidAuth(authOpts)
```

## Signing in and out

```ts
import { signIn, signOut } from "@auth/solid-start/client"
const login = () => signIn("github")
const logout = () => signOut()
```

## Getting the current session

```ts
import { getSession } from "@auth/solid-start"
import { createServerData$ } from "solid-start/server"
import { authOpts } from "~/routes/api/auth/[...solidauth]"

export const useSession = () => {
  return createServerData$(
    async (_, { request }) => {
      return await getSession(request, authOpts)
    },
    { key: () => ["auth_user"] }
  )
}

// useSession returns a resource:
const session = useSession()
const loading = session.loading
const user = () => session()?.user
```
