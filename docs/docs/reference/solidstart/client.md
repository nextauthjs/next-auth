---
title: Client
---

## Signing in

```ts
import { signIn } from "@auth/solid-start/client"
signIn()
signIn("provider") // example: signIn("github")
```

### Using the `signinInfo` option

A string may be passed to the `signinInfo` parameter of the client's `signIn()` method. That string will be available in the `signIn` callback, the `createUser` adapter function, and the `createUser` event. This may be helpful in determining if a user can login (e.g. users must enter an invitation code or beta key) or in creating a user (e.g. the primary key is a user-supplied "DisplayName" - you'll likely need to write your own adapter).

`signinInfo` must be a string. You are in charge of de/serialization.

Example usage:

- `signIn("google", { signinInfo: "Bill Johnson" })`

## Signing out

```ts
import { signOut } from "@auth/solid-start/client"
signOut()
```
