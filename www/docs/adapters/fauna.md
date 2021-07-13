---
id: fauna
title: FaunaDB Adapter
---

# FaunaDB

This is the Fauna Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find the Fauna schema and seed information in the docs at [next-auth.js.org/adapters/fauna](https://next-auth.js.org/adapters/fauna).

## Getting Started

1. Install `next-auth` and `@next-auth/fauna-adapter`

```js
npm install next-auth @next-auth/fauna-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import * as Fauna from "faunadb"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

const client = new Fauna.Client({
  secret: "secret",
  scheme: "http",
  domain: "localhost",
  port: 8443,
})

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FaunaAdapter({ faunaClient: client})
  ...
})
```

## Schema

Run the following commands inside of the `Shell` tab in the Fauna dashboard to setup the appropriate collections and indexes.

```javascript
CreateCollection({ name: "accounts" })
CreateCollection({ name: "sessions" })
CreateCollection({ name: "users" })
CreateCollection({ name: "verification_requests" })
CreateIndex({
  name: "account_by_provider_account_id",
  source: Collection("accounts"),
  unique: true,
  terms: [
    { field: ["data", "providerId"] },
    { field: ["data", "providerAccountId"] },
  ],
})
CreateIndex({
  name: "session_by_token",
  source: Collection("sessions"),
  unique: true,
  terms: [{ field: ["data", "sessionToken"] }],
})
CreateIndex({
  name: "user_by_email",
  source: Collection("users"),
  unique: true,
  terms: [{ field: ["data", "email"] }],
})
CreateIndex({
  name: "verification_request_by_token_and_identifier",
  source: Collection("verification_requests"),
  unique: true,
  terms: [{ field: ["data", "token"] }, { field: ["data", "identifier"] }],
})
```
