---
id: upstash-redis
title: Upstash Redis
---

# Upstash Redis

To use this Adapter, you need to install `@upstash/redis` and `@next-auth/upstash-redis-adapter` package:

```bash npm2yarn
npm install @upstash/redis@0.2.1 @next-auth/upstash-redis-adapter
```
Please make sure to use `@usptash/redis` version `0.2.1`. Later versions are incompatible right now.
Progress is tracked [here](https://github.com/nextauthjs/next-auth/issues/4183)

Configure your NextAuth.js to use the Upstash Redis Adapter:

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter"
import upstashRedisClient from "@upstash/redis"

const redis = upstashRedisClient(
  process.env.UPSTASH_REDIS_URL,
  process.env.UPSTASH_REDIS_TOKEN
)

export default NextAuth({
  adapter: UpstashRedisAdapter(redis),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
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
