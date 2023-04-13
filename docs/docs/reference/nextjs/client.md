---
title: Client
---

:::warning WIP
`@auth/nextjs/client` is work in progress. For now, please use [NextAuth.js Client API](https://next-auth.js.org/getting-started/client).
:::

### Using the `signinInfo` option

A string may be passed to the `signinInfo` parameter of the client's `signIn()` method. That string will be available in the `signIn` callback, the `createUser` adapter function, and the `createUser` event. This may be helpful in determining if a user can login (e.g. users must enter an invitation code or beta key) or in creating a user (e.g. the primary key is a user-supplied "DisplayName" - you'll likely need to write your own adapter).

`signinInfo` must be a string. You are in charge of de/serialization.

Example usage:

- `signIn("google", { signinInfo: "Bill Johnson" })`

