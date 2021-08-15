---
id: overview
title: Overview
---

An **Adapter** in NextAuth.js connects your application to whatever database or backend system you want to use to store data for users, their accounts, sessions, etc. Adapters are optional, unless you need to persist user information in your own database, or you wnt implement certain flows. The [Email Provider](/providers/email) requires an adapter to be able to save [Verification Tokens](/adapters/models#verification-token).

:::tip
When using a database, you can still use JWT for session handling for fast access. See the [`session.jwt`](/configuration/options#session) option. Read about the trade-offs of JWT in this [FAQ section](/faq#json-web-tokens).
:::

The official adapters can be found in their own repository under [`nextauthjs/adapters`](https://github.com/nextauthjs/adapters).

There you can find the following adapters:

- [`typeorm-legacy`](./typeorm/typeorm-overview)
- [`prisma`](./prisma)
- [`fauna`](./fauna)
- [`dynamodb`](./dynamodb)
- [`firebase`](./firebase)
- [`pouchdb`](./pouchdb)

## Custom Adapter

See the tutorial for [creating a database Adapter](/tutorials/creating-a-database-adapter) for more information on how to create a custom Adapter.

:::tip
If you would like to see a new adapter in the official repository, please [open a PR](https://github.com/nextauthjs/adapters) and we will help you.
:::

### Editor integration

When writing your own custom Adapter in plain JavaScript, note that you can use **JSDoc** to get helpful editor hints and auto-completion like so:

```js
/** @return { import("next-auth/adapters").Adapter } */
function MyAdapter() {
  return {
    // your adapter methods here
  }
}
```

:::note
This will work in code editors with a strong TypeScript integration like VSCode or WebStorm. It might not work if you're using more lightweight editors like VIM or Atom.
:::
