---
title: SolidStart Auth
---

# Getting started

Recommended to use [create-jd-app](https://github.com/OrJDev/create-jd-app), this will create a new SolidStart app with `@auth/solid-start`, generated secret and optionally prisma configuration.

## Installation

```bash
npm install @auth/solid-start@latest @auth/core@latest
```

## Setting It Up

[Generate auth secret](https://generate-secret.vercel.app/32), then set it as an environment variable:

```
AUTH_SECRET=your_auth_secret
```

## Creating the api handler

in this example we are using github so make sure to set the following environment variables:

```
GITHUB_ID=your_github_oatuh_id
GITHUB_SECRET=your_github_oatuh_secret
```

```ts
// routes/api/auth/[...solidauth].ts
import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start"
import GitHub from "@auth/core/providers/github"

export const authOpts: SolidAuthConfig = {
  providers: [
    // @ts-expect-error types issue
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

### Server Side

```ts
import { getSession } from "@auth/solid-start"
import { authOpts } from "~/routes/api/auth/[...solidauth]"

async function getMySessionFromServer(request: Request) {
  return await getSession(request, authOpts)
}
```

### Client Side

First wrap your `root.tsx` with a `SessionProvider`

```tsx
// @refresh reload
import { Suspense } from "solid-js"
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start"
import { SessionProvider } from "@auth/solid-start/client"

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>Create JD App</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body>
        <SessionProvider>
          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </SessionProvider>
        <Scripts />
      </Body>
    </Html>
  )
}
```

And now you could simply get the session using the `createSession` hook:

```tsx
import { createSession } from "@auth/solid-start/client"

export default function MyHelloWorldPage() {
  const session = createSession()

  const data = () => session()?.data
  const user = () => data()?.user

  return <h1>{...}</h1>
}
```
