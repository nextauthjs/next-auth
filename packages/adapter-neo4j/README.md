<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="./logo.svg" />
   <h3 align="center"><b>Neo4j Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="Canary CI Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/neo4j-adapter" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/neo4j-adapter" alt="@next-auth/neo4j-adapter Version" />
   </p>
</p>

## Overview

This is the Neo4j Adapter for [`auth.js`](https://authjs.dev). This package can only be used in conjunction with the primary `auth.js` package. It is not a standalone package.

You can find the Neo4j schema in the docs at [authjs.dev/reference/adapters/neo4j](authjs.dev/reference/adapters/neo4j).

## Getting Started

1. Install `neo4j-driver`, `next-auth` and `@next-auth/neo4j-adapter`

```js
npm install neo4j-driver next-auth @next-auth/neo4j-adapter@next
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import neo4j from "neo4j-driver"
import { Neo4jAdapter } from "@next-auth/neo4j-adapter"

// Setup your neo4j driver instance
const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "password")
)
const neo4jSession = driver.session()

export default NextAuth({
  // https://authjs.dev/reference/providers/oauth-builtin
  providers: [],
  adapter: Neo4jAdapter(neo4jSession),
  ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please first read our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/canary/CONTRIBUTING.md).

## License

ISC
