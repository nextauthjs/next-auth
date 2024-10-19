---
id: pubkey
title: Pubkey
---

NextAuth.js has an active community of developers building tools and plugins that extend NextAuth.js.

`next-auth-pubkey` is a light-weight plugin for NextAuth.js that enables public-private key based authentication.

It's entirely self-hosted, meaning no 3rd party API keys required, and it currently supports Lightning and Nostr pubkey auth.

## Complete docs

[https://www.npmjs.com/package/next-auth-pubkey](https://www.npmjs.com/package/next-auth-pubkey)


## Getting started

#### Install

```bash
npm i next-auth-pubkey
```

#### .env

You'll need to setup a couple of env vars in your project's `.env` file. However, you may already have them defined as part of your `next-auth` configuration.

---

The `NEXTAUTH_URL` env var must be defined as the canonical URL of your site.

```bash
NEXTAUTH_URL="http://localhost:3000"
```

---

The `NEXTAUTH_SECRET` env var must be defined as a securely generated random string.

```bash
NEXTAUTH_SECRET="<super-secret-random-string>"
```

You can quickly create a good value for `NEXTAUTH_SECRET` on the command line via this `openssl` command.

```bash
openssl rand -base64 32
```

#### API

Create a new API route under `pages/api/pubkey/[...pubkey].ts`

This API will handle all of the pubkey auth API requests, such as generating QRs, handling callbacks, polling and issuing JWT auth tokens.

```typescript
// @/pages/api/pubkey/[...pubkey].ts

import NextAuthPubkey, { NextAuthPubkeyConfig } from "next-auth-pubkey";
import generateQr from "next-auth-pubkey/generators/qr";

const config: NextAuthPubkeyConfig = {
  baseUrl: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  storage: {
    async set({ k1, session }) {
      // save lnurl auth session data based on k1 id
    },
    async get({ k1 }) {
      // lookup and return lnurl auth session data based on k1 id
    },
    async update({ k1, session }) {
      // update lnurl auth session data based on k1 id
    },
    async delete({ k1 }) {
      // delete lnurl auth session data based on k1 id
    },
  },
  generateQr,
};

const { lightningProvider, nostrProvider, handler } = NextAuthPubkey(config);

export { lightningProvider, nostrProvider };

export default handler;
```

> ℹ️ The above example uses the Pages Router. If your app uses the App Router then take a look at the [examples/app-router/](https://github.com/jowo-io/next-auth-pubkey/tree/main/examples/app-router/) example app.

#### Provider

In your existing `pages/api/auth/[...nextauth].ts` config file, import and add the Lightning provider to the provider array.

```typescript
// @/pages/api/auth/[...nextauth].ts

import { lightningProvider, nostrProvider } from "../pubkey/[...pubkey]"; // <--- import the providers from the pubkey API route

export const authOptions: AuthOptions = {
  providers: [
    lightningProvider, // <--- and add the providers to the providers array
    nostrProvider, //     <--- and add the providers to the providers array
  ],
};

export default NextAuth(authOptions);
```