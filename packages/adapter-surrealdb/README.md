<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>
   <h3 align="center"><b>SurrealDB Adapter</b> - NextAuth.js</h3>
</p>

## Overview

This is the SurrealDB Adapter for [`auth.js`](https://authjs.dev). This package can only be used in conjunction with the primary `auth.js` package. It is not a standalone package.

## Getting Started

### RPC

1. Install `surrealdb.js`, `next-auth` and `@next-auth/surrealdb-adapter`

```js
npm install surrealdb.js next-auth @next-auth/surrealdb-adapter@next
```

2. Add `lib/surrealdb.js`

```js
import { Surreal } from "surrealdb.js";

const host = ...
const port = ...
const user = ...
const pass = ...
const ns = ...
const db = ...
const protocol = ...

export const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal("${protocol}://${host}:${port}/rpc")
  try {
    await db.signin({ user, pass })
    await db.use(ns, db)
    resolve(db)
  } catch (e) {
    reject(e)
  }
})
```

3. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```ts
import NextAuth from "next-auth"
import { clientPromise } from "../../../server/db/client";

export default NextAuth({
  adapter: SurrealDBAdapter(clientPromise),
  ...
})
```

### Restfull

1. Install `surrealdb-rest-ts`, `next-auth` and `@next-auth/surrealdb-adapter`

```js
npm install surrealdb-rest-ts next-auth @next-auth/surrealdb-adapter@next
```

2. Add `lib/surrealdb.js`

```js
import { SurrealREST as Surreal } from "surrealdb-rest-ts";

const host = ...
const port = ...
const user = ...
const pass = ...
const ns = ...
const db = ...
const protocol = ...

export const clientPromise = new Promise<Surreal>((resolve) => {
  resolve(
    new Surreal(`${protocol}://${host}:${port}`, {
      ns,
      db,
      user,
      password: pass,
    })
  );
});
```

3. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```ts
import NextAuth from "next-auth"
import { clientPromise } from "../../../server/db/client";

export default NextAuth({
  adapter: SurrealDBAdapter(clientPromise),
  ...
})
```

## License

ISC
