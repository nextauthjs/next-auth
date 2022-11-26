<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="./logo.svg" />
   <h3 align="center"><b>Mongoose Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="CI Test" />
      <a href="https://www.npmjs.com/package/@next-auth/mongodb-adapter" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/@next-auth/mongodb-adapter" alt="Bundle Size"/></a>
      <a href="https://www.npmjs.com/package/@next-auth/mongodb-adapter" target="_blank"><img src="https://img.shields.io/npm/v/@next-auth/mongodb-adapter" alt="@next-auth/mongodb-adapter Version" /></a>
   </p>
</p>

## Overview

This is the Mongoose Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install `mongoose`, `next-auth` and `@next-auth/mongoose-adapter`

```js
npm install mongoose next-auth @next-auth/mongoose-adapter@next
```

2. Add `lib/dbConnect.js`

```js
// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb-mongoose
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
```

3. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { MongooseAdapter } from "@next-auth/mongoose-adapter"
import dbConnect from "lib/dbConnect"

const mongooseConnect = dbConnect()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  adapter: MongooseAdapter(mongooseConnect),
  ...
})
```

4. Optionally, create mongoose models from schemas.

```js
import { 
    defaultCollections, 
    SchemaUser,
    SchemaAccount,
    SchemaSession,
    SchemaVerificationToken,
} from "@next-auth/mongoose-adapter"
import { model }  from 'mongoose'

const UserModel = model('User', SchemaUser, defaultCollections.Users)
const AccountModel = model('Account', SchemaAccount, defaultCollections.Accounts)
const SessionModel = model('Session', SchemaSession, defaultCollections.Sessions)
const VerificationTokenModel = model('VerificationToken', SchemaVerificationToken, defaultCollections.VerificationTokens)
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/main/CONTRIBUTING.md).

## License

ISC
