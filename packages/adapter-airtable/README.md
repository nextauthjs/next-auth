<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="airtable-logo.png" />
   <h3 align="center"><b>Airtable Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <!-- <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="CI Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/prisma-adapter" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/prisma-adapter" alt="@next-auth/prisma-adapter Version" />
   </p> -->
</p>

## Overview

This is the [Airtable](https://airtable.com) Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install `next-auth` and `@next-auth/airtable-adapter`

```js
npm install next-auth @next-auth/airtable-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { AirtableAdapater } from "@next-auth/airtable-adapter";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    ...,
  ],
  adapter: AirtableAdapter({
    apiKey: process.env.AIRTABLE_API_KEY,
    baseId: process.env.AIRTABLE_BASE_ID,
  }),
  ...
})
```

3. Clone this base in Airtable: https://airtable.com/shr16Xd8glUk90c4P

4. Add your apiKey and the baseId of the cloned base to .env:

```
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX // From your account page
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX // e.g. https://airtable.com/baseId/something/somethingelse/
```
