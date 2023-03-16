---
id: overview
title: Overview
---

An **Adapter** in NextAuth.js connects your application to whatever database or backend system you want to use to store data for users, their accounts, sessions, etc. Adapters are optional, unless you need to persist user information in your own database, or you want to implement certain flows. The [Email Provider](/providers/email) requires an adapter to be able to save [Verification Tokens](/adapters/models#verification-token).

:::tip
When using a database, you can still use JWT for session handling for fast access. See the [`session.strategy`](/configuration/options#session) option. Read about the trade-offs of JWT in the [FAQ](/faq#json-web-tokens).
:::

We have a list of official adapters that are distributed as their own packages under the `@next-auth/{name}-adapter` namespace. Their source code is available in their various adapters package directories at [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth/tree/main/packages).

- [`dgraph`](https://authjs.dev/reference/adapter/dgraph)
- [`dynamodb`](https://authjs.dev/reference/adapter/dynamodb)
- [`fauna`](https://authjs.dev/reference/adapter/fauna)
- [`firebase`](https://authjs.dev/reference/adapter/firebase)
- [`mongodb`](https://authjs.dev/reference/adapter/mongodb)
- [`prisma`](https://authjs.dev/reference/adapter/prisma)
- [`typeorm-legacy`](https://authjs.dev/reference/adapter/typeorm)
- [`MikroORM`](https://authjs.dev/reference/adapters/mikro-orm)
- [`neo4j`](https://authjs.dev/reference/adapters/neo4j)
- [`pouchdb`](https://authjs.dev/reference/adapters/pouchdb)
- [`sequelize`](https://authjs.dev/reference/adapters/sequelize)
- [`supabase`](https://authjs.dev/reference/adapters/supabase)
- [`upstash-redis`](https://authjs.dev/reference/adapters/upstash-redis)
- [`xata`](https://authjs.dev/reference/adapters/xata)

## Custom Adapter

If you have a database/backend that we don't officially support, you can create your own adapter.
See the tutorial for [creating a database Adapter](/tutorials/creating-a-database-adapter) for more information.

:::tip
If you would like to see a new adapter in the official repository, please [open a PR](https://github.com/nextauthjs/next-auth/issues/new) and we will help you to get it merged. Tell us if you are interested in becoming one of the maintainers of any of the official adapters.
:::

### Editor integration

Adapters are strongly typed, and they rely on the single `Adapter` interface imported from `next-auth/adapters`.

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
