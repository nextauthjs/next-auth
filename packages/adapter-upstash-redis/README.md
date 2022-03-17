<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="logo.svg" />
   <h3 align="center"><b>Upstash Redis Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="CI Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/upstash-adapter" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/upstash-adapter" alt="@next-auth/upstash-adapter Version" />
   </p>
</p>

## Overview

This is the Upstash Redis adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` and `@upstash/redis` packages. It is not a standalone package.

## Getting Started

1. Install `next-auth` and `@next-auth/upstash-redis-adapter` as well as `@upstash/redis` via NPM.

```js
npm install next-auth @next-auth/upstash-redis-adapter @upstash/redis@0.2.1
```
Please make sure to use `@usptash/redis` version `0.2.1`. Later versions are incompatible right now.
Progress is tracked [here](https://github.com/nextauthjs/next-auth/issues/4183)

2. Add the follwing code to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { UpstashRedisAdapter } from "@next-auth/upstash-adapter"
import upstashRedisClient from "@upstash/redis"

const redis = upstashRedisClient("UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN")

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  ...
  adapter: UpstashRedisAdapter(redis)
  ...
})
```

## Using Multiple Apps with a Single Upstash Redis Instance

The Upstash free-tier allows for only one Redis instance. If you have multiple Next-Auth connected apps using this instance, you need different key prefixes for every app.

You can change the prefixes by passing an `options` object as the second argument to the adapter factory function.

The default values for this object are:

```js
const defaultOptions = {
  baseKeyPrefix: "",
  accountKeyPrefix: "user:account:",
  accountByUserIdPrefix: "user:account:by-user-id:",
  emailKeyPrefix: "user:email:",
  sessionKeyPrefix: "user:session:",
  sessionByUserIdKeyPrefix: "user:session:by-user-id:",
  userKeyPrefix: "user:",
  verificationTokenKeyPrefix: "user:token:",
}
```

Usually changing the `baseKeyPrefix` should be enough for this scenario, but for more custom setups, you can also change the prefixes of every single key.

Example:

```js
export default NextAuth({
  ...
  adapter: UpstashRedisAdapter(redis, {baseKeyPrefix: "app2:"})
  ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/adapters/blob/main/CONTRIBUTING.md).

## License

ISC
