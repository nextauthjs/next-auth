---
title: Using a database adapter
---

An **Adapter** in Auth.js connects your application to whatever database or backend system you want to use to store data for users, their accounts, sessions, etc. Adapters are optional, unless you need to persist user information in your own database, or you want to implement certain flows. The [Email Provider](/getting-started/email-tutorial) requires an adapter to be able to save [Verification Tokens](/reference/adapters/models#verification-token).

:::tip
When using a database, you can still use JWT for session handling for fast access. See the [`session.strategy`](/reference/configuration/auth-config#session) option. Read about the trade-offs of JWT in the [FAQ](/concepts/faq#json-web-tokens).
:::

We have a list of official adapters that are distributed as their own packages under the `@next-auth/{name}-adapter` namespace. Their source code is available in their various adapters package directories at [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth/tree/main/packages):

- [All available adapters](/reference/adapters/overview)
