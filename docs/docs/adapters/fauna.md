---
id: fauna
title: FaunaDB
---

# FaunaDB

This is the Fauna Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find the Fauna schema and seed information in the docs at [next-auth.js.org/adapters/fauna](https://next-auth.js.org/adapters/fauna).

## Getting Started

1. Install the necessary packages

```bash npm2yarn
npm install next-auth @next-auth/fauna-adapter faunadb
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { Client as FaunaClient } from "faunadb"
import { FaunaAdapter } from "@next-auth/fauna-adapter"

const client = new FaunaClient({
  secret: "secret",
  scheme: "http",
  domain: "localhost",
  port: 8443,
})

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers/overview
  providers: [],
  adapter: FaunaAdapter(client)
  ...
})
```

## Schema

Run the following commands inside of the `Shell` tab in the Fauna dashboard to setup the appropriate collections and indexes.

```javascript
CreateCollection({ name: "accounts" })
CreateCollection({ name: "sessions" })
CreateCollection({ name: "users" })
CreateCollection({ name: "verification_tokens" })
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
  name: "session_by_session_token",
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
  name: "verification_token_by_identifier_and_token",
  source: Collection("verification_tokens"),
  unique: true,
  terms: [{ field: ["data", "identifier"] }, { field: ["data", "token"] }],
})
```
