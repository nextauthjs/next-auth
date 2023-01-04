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

## Getting the session

```ts
import { useSession } from "@auth/solid-start/client"

const session = useSession() // client side session

session.user
session.expires
```
