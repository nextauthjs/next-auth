<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>
   <h3 align="center"><b>SurrealDB Adapter</b> - NextAuth.js</h3>
</p>

## Overview

This is the SurrealDB Adapter for [`auth.js`](https://authjs.dev). This package can only be used in conjunction with the primary `auth.js` package. It is not a standalone package.

## Getting Started

1. Install `surrealdb.js`, `next-auth` and `@next-auth/surrealdb-adapter`

```js
npm install surrealdb.js next-auth @next-auth/surrealdb-adapter@next
```

2. Add `lib/surrealdb.js`

```js
import Surreal from "surrealdb.js";

const host = ...
const port = ...
const user = ...
const pass = ...
const ns = ...
const db = ...
const protocol = ...

let surreal: Surreal | null = null;

const init = async () => {
  try {
    surreal = new Surreal(`${protocol}://${host}:${port}/rpc`);
    await surreal.signin({ user, pass });
    await surreal.use(ns, db);
    return surreal;
  } catch (e) {
    throw e;
  }
};

export const getClient = async () => {
  if (surreal) return surreal;
  return await init();
};
```

3. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```ts
import NextAuth from "next-auth"
import { SurrealDBAdapter } from "@next-auth/surrealdb-adapter"
import clientPromise from "lib/mongodb"

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/configuration/auth-options
export default NextAuth({
  adapter: SurrealDBAdapter(clientPromise),
  ...
})
```

## License

ISC
