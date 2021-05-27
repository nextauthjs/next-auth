---
id: firebase
title: Firebase Adapter
---

# Firebase

This is the Firebase Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install `next-auth` and `@next-auth/firebase-adapter`

```js
npm install next-auth @next-auth/firebase-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { FirebaseAdapter } from "@next-auth/firebase-adapter"
import firebase from "firebase-admin"
const firestore = firebase.initializeApp({ /* your config */ }).firestore()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirebaseAdapter(firestore),
  ...
})
```
