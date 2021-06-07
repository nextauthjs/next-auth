---
id: pouchdb
title: PouchDB Adapter
---

# PouchDB

This is the PouchDB Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

Depending on your architecture you can use PouchDB's http adapter to reach any database compliant with the CouchDB protocol (CouchDB, Cloudant, ...) or use any other PouchDB compatible adapter (leveldb, in-memory, ...)

## Getting Started

1. Install `next-auth` and `@next-auth/pouchdb-adapter@canary`

```js
npm install next-auth @next-auth/pouchdb-adapter@canary
```

2. Add this adapter to your `pages/api/auth/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { PouchDBAdapter } from "@next-auth/pouchdb-adapter"
import PouchDB from "pouchdb"

// Setup your PouchDB instance and database
PouchDB.plugin(require("pouchdb-adapter-leveldb")) // or any other adapter
  .plugin(require("pouchdb-find")) // /!\ don't forget the pouchdb-find plugin
const pouchdb = new PouchDB("auth_db", { adapter: "leveldb" })

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
  adapter: PouchDBAdapter(pouchdb),
  // ...
})
```

## Advanced usage : memory-first caching strategy

If you need to boost your authentication layer performance, you may use PouchDB's powerful sync features and various adapters, to build a memory-first caching strategy.

Use an in-memory PouchDB as your main authentication database, and synchronize it with any other persisted PouchDB. You may do a one way, one-off replication at startup from the persisted PouchDB into the in-memory PouchDB, then two-way, continuous, retriable sync.

To go further, see : <https://pouchdb.com/api.html#sync>

Caveat : this would probably not work in a serverless environment for various reasons (concurrency, serverless function startup time increase, etc.)
