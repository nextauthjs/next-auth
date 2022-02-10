---
id: firebase
title: Firebase
---

# Firebase

:::warning
This adapter is still experimental and does not work with NextAuth.js 4 or newer. If you would like to help out upgrading it, please visit [this PR](https://github.com/nextauthjs/adapters/pull/183)
:::

This is the Firebase Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install the necessary packages

```bash npm2yarn
npm install next-auth @next-auth/firebase-adapter@experimental
```

2. Add this adapter to your `pages/api/auth/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { FirebaseAdapter } from "@next-auth/firebase-adapter"

import firebase from "firebase/app"
import "firebase/firestore"

const firestore = (
  firebase.apps[0] ?? firebase.initializeApp(/* your config */)
).firestore()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers/overview
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: FirebaseAdapter(firestore),
  ...
})
```

## Options

When initializing the firestore adapter, you must pass in the firebase config object with the details from your project. More details on how to obtain that config object can be found [here](https://support.google.com/firebase/answer/7015592).

An example firebase config looks like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSyDOCAbC123dEf456GhI789jKl01-MnO",
  authDomain: "myapp-project-123.firebaseapp.com",
  databaseURL: "https://myapp-project-123.firebaseio.com",
  projectId: "myapp-project-123",
  storageBucket: "myapp-project-123.appspot.com",
  messagingSenderId: "65211879809",
  appId: "1:65211879909:web:3ae38ef1cdcb2e01fe5f0c",
  measurementId: "G-8GSGZQ44ST",
}
```

See [firebase.google.com/docs/web/setup](https://firebase.google.com/docs/web/setup) for more details.

:::tip **From Firebase**

**Caution**: We do not recommend manually modifying an app's Firebase config file or object. If you initialize an app with invalid or missing values for any of these required "Firebase options", then your end users may experience serious issues.

For open source projects, we generally do not recommend including the app's Firebase config file or object in source control because, in most cases, your users should create their own Firebase projects and point their apps to their own Firebase resources (via their own Firebase config file or object).
:::
