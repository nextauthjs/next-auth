---
id: firebase-admin
title: Firebase Admin
---

This is the Firebase Admin Adapter for [`next-auth`](https://authjs.dev). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install the necessary packages

```bash npm2yarn
npm install next-auth @next-auth/firebase-admin-adapter firebase-admin
```

2. Create a Firebase project and generate a service account key. See [instructions](https://firebase.google.com/docs/admin/setup).

3. Add this adapter to your `pages/api/auth/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { FirestoreAdminAdapter } from "@next-auth/firebase-admin-adapter"

import admin from "firebase-admin"

// Initialize the firebase admin app. By default, the firebase admin sdk will
// look for the GOOGLE_APPLICATION_CREDENTIALS environment variable and use
// that to authenticate with the firebase project. See other authentication
// methods here: https://firebase.google.com/docs/admin/setup
const app = admin.initializeApp()

const firestore = app.firestore()

// For more information on each option (and a full list of options) go to
// https://authjs.dev/reference/configuration/auth-options
export default NextAuth({
  // https://authjs.dev/reference/providers/
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirestoreAdminAdapter(firestore),
  ...
})
```

## Naming Conventions

If mixed snake_case and camelCase field names in the database is an issue for you, you can pass the option `preferSnakeCase: true` to the adapter. This will convert all
fields names and collection names to snake_case e.g. the collection `verificationTokens` will instead be `verification_tokens`, and fields like `emailVerified` will instead be `email_verified`.

```javascript
FirestoreAdminAdapter(firestore, { preferSnakeCase: true })
```
