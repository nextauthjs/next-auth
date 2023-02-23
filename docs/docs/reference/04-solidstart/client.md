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

## Getting The Current Session

```tsx
import { createSession } from "@auth/solid-start/client"

export default function MyHelloWorldPage() {
  const session = createSession()

  const data = () => session()?.data
  const user = () => data()?.user

  return <h1>{...}</h1>
}
```
