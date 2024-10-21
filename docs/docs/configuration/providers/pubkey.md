---
id: pubkey
title: Pubkey
---

NextAuth.js has an active community of developers building tools and plugins that extend NextAuth.js.

`next-auth-pubkey` is a light-weight plugin for NextAuth.js that enables public-private key based authentication.

It's entirely self-hosted, meaning no 3rd party API keys required, and it currently supports Lightning and Nostr pubkey auth.

## Getting started

### Install

```bash npm2yarn2pnpm
npm install next-auth-pubkey
```

### Adding .env vars

You'll need to setup a couple of env vars in your project's `.env` file. However, you may already have them defined as part of your NextAuth.js configuration.

The [NEXTAUTH_URL](/configuration/options#nextauth_url) env var must be defined as the canonical URL of your site.

The [NEXTAUTH_SECRET](/configuration/options#nextauth_secret) env var must be defined as a securely generated random string.

### Pubkey API

Create a new API route under `pages/api/pubkey/[...pubkey].ts`

This API will handle all of the pubkey auth API requests, such as generating QRs, handling callbacks, polling and issuing JWT auth tokens.

```ts title="@/pages/api/pubkey/[...pubkey].ts"

import NextAuthPubkey, { NextAuthPubkeyConfig } from "next-auth-pubkey";
import generateQr from "next-auth-pubkey/generators/qr";

const config: NextAuthPubkeyConfig = {
  baseUrl: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, data }) {
      // save pubkey data based on k1 id
    },
    async get({ k1 }) {
      // lookup and return pubkey data based on k1 id
    },
    async update({ k1, data }) {
      // update pubkey data based on k1 id
    },
    async delete({ k1 }) {
      // delete pubkey data based on k1 id
    },
  },
  generateQr,
};

const { lightningProvider, nostrProvider, handler } = NextAuthPubkey(config);

export { lightningProvider, nostrProvider };

export default handler;
```

> ℹ️ The above example uses the Pages Router. If your app uses the App Router see:
> [https://github.com/jowo-io/next-auth-pubkey/tree/main/examples/app-router/](https://github.com/jowo-io/next-auth-pubkey/tree/main/examples/app-router/)

### Configuring Providers

In your existing `pages/api/auth/[...nextauth].ts` config file, import and add the pubkey providers to the providers array.

```ts title="@/pages/api/pubkey/[...pubkey].ts"

import { lightningProvider, nostrProvider } from "../pubkey/[...pubkey]"; // <--- import the providers from the pubkey API route

export const authOptions: AuthOptions = {
  providers: [
    lightningProvider, // <--- add the provider to the providers array
    nostrProvider, //     <--- add the provider to the providers array
  ],
};

export default NextAuth(authOptions);
```

## Complete docs

[https://www.npmjs.com/package/next-auth-pubkey](https://www.npmjs.com/package/next-auth-pubkey)

