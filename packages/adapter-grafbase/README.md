<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank">
    <img height="64px" src="https://authjs.dev/img/logo/logo-sm.png" />
  </a>
  <a href="https://grafbase.com/" target="_blank">
    <img height="64px" src="https://authjs.dev/img/adapters/grafbase.svg"/>
  </a>
  <h3 align="center"><b>Grafbase Adapter</b> - NextAuth.js / Auth.js</a></h3>
  <p align="center" style="align: center;">
    <a href="https://npm.im/@auth/grafbase-adapter">
      <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
    </a>
    <a href="https://npm.im/@auth/grafbase-adapter">
      <img alt="npm" src="https://img.shields.io/npm/v/@auth/grafbase-adapter?color=green&label=@auth/grafbase-adapter&style=flat-square">
    </a>
    <a href="https://www.npmtrends.com/@auth/grafbase-adapter">
      <img src="https://img.shields.io/npm/dm/@auth/grafbase-adapter?label=%20downloads&style=flat-square" alt="Downloads" />
    </a>
    <a href="https://github.com/nextauthjs/next-auth/stargazers">
      <img src="https://img.shields.io/github/stars/nextauthjs/next-auth?style=flat-square" alt="Github Stars" />
    </a>
  </p>
</p>

---

Check out the documentation at [authjs.dev](https://authjs.dev/reference/adapter/grafbase).

## Overview

This is the [Grafbase](https://grafbase.com) Adapter for [`next-auth`](https://github.com/nextauthjs/next-auth).

This package works together with NextAuth.js and Grafbase Auth &mdash; [learn more](https://grafbase.com/docs/auth/overview).

## Usage

1. Install `next-auth` and `@next-auth/grafbase-adapter`:

```bash
npm install next-auth @next-auth/grafbase-adapter
```

2. Import `GrafbaseAdapter` and add to the `next-auth` configuration object:

```typescript title="pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { GrafbaseAdapter } from "@next-auth/grafbase-adapter"

export default NextAuth({
  adapter: GrafbaseAdapter({
    url: process.env.GRAFBASE_API_URL,
    apiKey: process.env.GRAFBASE_API_KEY,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

3. Initialize a Grafbase backend in the root of your project:

```bash
npx grafbase init --template https://github.com/nextauthjs/next-auth/tree/main/packages/adapter-grafbase
```

4. Run your backend locally, or deploy to the edge:

```bash
npx grafbase dev
```

You will need to add the `GRAFBASE_API_URL` with your local backend URL to `.env.local`. You can ignore adding a `apiKey` value in development.

## Contributing

This project is open-source. PRs welcome!

## License

ISC
