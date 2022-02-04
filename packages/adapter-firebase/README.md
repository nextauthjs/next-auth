<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank">
    <img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a><img height="64px" src="https://raw.githubusercontent.com/nextauthjs/adapters/main/packages/firebase/logo.svg" />
   <h3 align="center"><b>Firebase Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="Build Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/firebase-adapter/latest" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/firebase-adapter" alt="@next-auth/firebase-adapter Version" />
   </p>
</p>

## Overview

This is the Firebase Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find more Firebase information in the docs at [next-auth.js.org/adapters/firebase](https://next-auth.js.org/adapters/firebase).

## Getting Started

1. Install `next-auth` and `@next-auth/firebase-adapter`.

```js
npm install next-auth @next-auth/firebase-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { FirebaseAdapter } from "@next-auth/firebase-adapter"

import firebase from "firebase/app"
import "firebase/firestore"

const firestore = (
  firebase.apps[0] ?? firebase.initializeApp(/* your config */)
).firestore()

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

> **From Firebase - Caution**: We do not recommend manually modifying an app's Firebase config file or object. If you initialize an app with invalid or missing values for any of these required "Firebase options", then your end users may experience serious issues.
>
> For open source projects, we generally do not recommend including the app's Firebase config file or object in source control because, in most cases, your users should create their own Firebase projects and point their apps to their own Firebase resources (via their own Firebase config file or object).

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/adapters/blob/main/CONTRIBUTING.md).

## License

ISC
