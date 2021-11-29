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
  scheme: "https",
  domain: "db.fauna.com", // Your fauna connection domain which may be dependent on your region.
  port: 443,
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
// First this
  CreateCollection({ name: "users" }),
  CreateCollection({ name: "accounts" }),
  CreateCollection({ name: "sessions" }),
  CreateCollection({ name: "verification_tokens" })
  
// Then run this in the Fauna shell to create indexes
  CreateIndex({
    name: "accounts_by_user_id",
    source: Collection("accounts"),
    terms: [{ field: ["data", "userId"] }]
  })
  CreateIndex({
    name: "session_by_session_token",
    source: Collection("sessions"),
    unique: true,
    terms: [{ field: ["data", "sessionToken"] }],
  })
  CreateIndex({
    name: "sessions_by_user_id",
    source: Collection("sessions"),
    terms: [{ field: ["data", "userId"] }]
  })
  CreateIndex({
    name: "user_by_email",
    source: Collection("users"),
    unique: true,
    terms: [{ field: ["data", "email"] }],
  })
  CreateIndex({
    name: "account_by_provider_and_provider_account_id",
    source: Collection("accounts"),
    unique: true,
    terms: [
      { field: ["data", "provider"] },
      { field: ["data", "providerAccountId"] },
    ],
  })
  CreateIndex({
    name: "verification_token_by_identifier_and_token",
    source: Collection("verification_tokens"),
    unique: true,
    terms: [
      { field: ["data", "identifier"] },
      { field: ["data", "token"] },
    ],
  })
```
