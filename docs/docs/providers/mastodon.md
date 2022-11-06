---
id: mastodon
title: Mastodon
---

## Documentation

https://docs.joinmastodon.org/client/token/

## Configuration

https://mastodon.social/settings/applications

:::note
Mastodons user data does **not** include the users email!
:::

## Options

The **Mastodon Provider** comes with a set of default options:

- [Mastodon Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/mastodon.ts)

You can override any of the options to suit your own use case.

Due to Mastodons infrastructure beeing a Fediverse you have to define the `issuer` you want to connect to.

:::note
`issuer` should include the slug without a trailing slash – e.g., `https://mastodon.social`
:::

## Example

```ts
import MastodonProvider from "next-auth/providers/mastodon";
...
providers: [
  Mastodon({
    clientId: process.env.MASTODON_ID,
    clientSecret: process.env.MASTODON_SECRET,
    issuer: process.env.MASTODON_ISSUER
  }),
]
...
```
