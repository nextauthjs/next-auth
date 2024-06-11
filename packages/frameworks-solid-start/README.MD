# Getting started

Recommended to use [create-jd-app](https://github.com/OrJDev/create-jd-app)

```bash
npm install @auth/solid-start@latest @auth/core@latest
```

## Setting It Up

[Generate auth secret](https://generate-secret.vercel.app/32), then set it as an environment variable:

```
AUTH_SECRET=your_auth_secret
```

### On Production

Don't forget to trust the host.

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
  basePath: "/api/auth",
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
