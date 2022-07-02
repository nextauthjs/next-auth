---
id: pouchdb
title: PouchDB
---

# PouchDB

:::warning
This adapter is still experimental and does not work with NextAuth.js 4 or newer. If you would like to help out upgrading it, please [open a PR](https://github.com/nextauthjs/next-auth/tree/main/packages)
:::

This is the PouchDB Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

Depending on your architecture you can use PouchDB's http adapter to reach any database compliant with the CouchDB protocol (CouchDB, Cloudant, ...) or use any other PouchDB compatible adapter (leveldb, in-memory, ...)

## Getting Started

> **Prerequisites**: Your PouchDB instance MUST provide the `pouchdb-find` plugin since it is used internally by the adapter to build and manage indexes

1. Install `next-auth` and `@next-auth/pouchdb-adapter`

```bash npm2yarn
npm install next-auth @next-auth/pouchdb-adapter
```

2. Add this adapter to your `pages/api/auth/[...nextauth].js` next-auth configuration object

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PouchDBAdapter } from "@next-auth/pouchdb-adapter"
import PouchDB from "pouchdb"

// Setup your PouchDB instance and database
PouchDB.plugin(require("pouchdb-adapter-leveldb")) // Any other adapter
  .plugin(require("pouchdb-find")) // Don't forget the `pouchdb-find` plugin

const pouchdb = new PouchDB("auth_db", { adapter: "leveldb" })

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers/overview
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: PouchDBAdapter(pouchdb),
  // ...
})
```

## Advanced

### Memory-First Caching Strategy

If you need to boost your authentication layer performance, you may use PouchDB's powerful sync features and various adapters, to build a memory-first caching strategy.

Use an in-memory PouchDB as your main authentication database, and synchronize it with any other persisted PouchDB. You may do a one way, one-off replication at startup from the persisted PouchDB into the in-memory PouchDB, then two-way, continuous, retriable sync.

This will most likely not increase performance much in a serverless environment due to various reasons such as concurrency, function startup time increases, etc.

For more details, please see https://pouchdb.com/api.html#sync
