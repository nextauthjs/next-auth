---
id: firebase-admin
title: Firebase Admin
---

# Firebase Admin

This is the Firebase Admin SDK Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find more Firebase information in the docs at [next-auth.js.org/adapters/firebase-admin](https://next-auth.js.org/adapters/firebase-admin).

## Getting Started

1. Install `next-auth` and `@next-auth/firebase-admin-adapter`.

```js
npm install next-auth @next-auth/firebase-admin-adapter
```

2. Add this code to your `init.js`.

```js
import admin from "firebase-admin"

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
        authUri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
        clientX509CertUrl: process.env.FIREBASE_X509_CERT_URL,
      }),
    })
    admin.firestore().settings({ ignoreUndefinedProperties: true })
  } catch (error) {
    console.log("Firebase admin initialization error", error.stack)
  }
}
export default admin.firestore()
```

3. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth, { NextAuthOptions } from "next-auth"
import { FirestoreAdapterAdmin } from "next-auth-adapter/index"
import TwitterProvider from "next-auth/providers/twitter"
import db from "@firebase/init"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY,
      clientSecret: process.env.TWITTER_API_SECRET,
    }),
  ],
  adapter: FirestoreAdapterAdmin(db),
}

export default NextAuth(authOptions)
```
