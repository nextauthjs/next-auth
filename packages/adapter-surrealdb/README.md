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
import { SurrealREST } from "surrealdb-rest-ts";

const host = ...
const port = ...
const user = ...
const pass = ...
const ns = ...
const db = ...
const protocol = ...

export const clientPromise = new Promise<SurrealREST>((resolve) => {
  resolve(
    new SurrealREST(`${protocol}://${host}:${port}`, {
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
