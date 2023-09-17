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

const connectionString = ...
const user = ...
const pass = ...
const ns = ...
const db = ...

export const clientPromise = new Promise<Surreal>(async (resolve, reject) => {
  const db = new Surreal();
  try {
    await db.connect(`${connectionString}/rpc`, {
      ns, db, auth: { user, pass }
    })
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

### Restfull / HTTP

1. Install `surrealdb.js`, `next-auth` and `@next-auth/surrealdb-adapter`

```js
npm install surrealdb.js next-auth @next-auth/surrealdb-adapter@next
```

2. Add `lib/surrealdb.js`

```js
import { ExperimentalSurrealHTTP } from "surrealdb.js"
import fetch from "node-fetch"

const connectionString = ...
const user = ...
const pass = ...
const ns = ...
const db = ...

const clientPromise = new Promise<ExperimentalSurrealHTTP<typeof fetch>>(async (resolve, reject) => {
  try {
    const db = new ExperimentalSurrealHTTP(connectionString, {
      fetch,
      auth: {
        user,
        pass,
      },
      ns,
      db,
    })
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

## License

ISC
