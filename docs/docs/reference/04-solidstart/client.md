---
title: Client
---

## Signing in

```ts
import { signIn } from "@auth/solid-start/client"
signIn()
signIn("provider") // example: signIn("github")
```

## Signing out

```ts
import { signOut } from "@auth/solid-start/client"
signOut()
```

## Getting the current session

Wrap your `Root` with `SessionProvider`

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

And then you could use the `createSession` hook:

```ts
import { createSession } from "@auth/solid-start/client"
const session = createSession()

const data = () => session()?.data
const user = () => data()?.user
```
