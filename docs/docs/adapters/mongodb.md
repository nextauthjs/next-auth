---
id: mongodb
title: MongoDB
---

# MongoDB

The MongoDB adapter does not handle connections automatically, so you will have to make sure that you pass the Adapter a `MongoClient` that is connected already. Below you can see an example how to do this.

## Usage

1. Install the necessary packages

```bash npm2yarn2pnpm
npm install next-auth @next-auth/mongodb-adapter mongodb
```

2. Set MONGODB_URI environment variable with the URI from your MongoDB database to .env.local

3. Add `lib/mongodb.js`

```js
// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
```
OR, if you are using typescript, add `lib/mongodb.ts` and `globals.d.ts`

```ts
//mongodb.ts
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

let client;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
   if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
```

```ts
// globals.d.ts
// reference: https://stackoverflow.com/questions/68481686/type-typeof-globalthis-has-no-index-signature
export interface global {}
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}
```

4. Add this adapter to your `pages/api/auth/[...nextauth].js` OR `pages/api/auth/[...nextauth].ts` next-auth configuration object.

```js
...
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  ...
})
```
