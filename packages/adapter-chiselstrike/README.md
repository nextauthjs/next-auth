<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="logo.svg" />
   <h3 align="center"><b>ChiselStrike Adapter</b> - NextAuth.js</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/adapters/actions/workflows/release.yml/badge.svg" alt="Build Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/@next-auth/chiselstrike-adapter/latest" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/v/@next-auth/chiselstrike-adapter" alt="@next-auth/chiselstrike-adapter Version" />
   </p>
</p>

## Overview

This is the ChiselStrike Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary next-auth package. It is not a standalone package.

## Getting Started

Install `next-auth` and `@next-auth/chiselstrike-adapter` in your project:
```js
npm install next-auth @next-auth/chiselstrike-adapter
```

Configure NextAuth with the ChiselStrike adapter and a session callback to record the user ID.  In
`pages/api/auth/[...nextauth].js`:
```js
const adapter = new CSAdapter(<url>, <auth-secret>)

export default NextAuth({
  adapter,
  /// ...
  callbacks: {
    async session({ session, token, user }) {
      session.userId = user.id
      return session
    }
  }
})

```

When accessing ChiselStrike endpoints, you can provide the user ID value in a `ChiselUID` header.  This is how
ChiselStrike knows which user is logged into the current session.  For example:

```js
await fetch('<url>/<branch>/<endpoint-name>', { headers: { "ChiselUID": session.userId } })
```

## Contributing

Initial setup:
```bash
git clone git@github.com:nextauthjs/next-auth.git
cd next-auth
pnpm i
pnpm build
cd packages/adapter-chiselstrike
pnpm i
```

Before running a build/test cycle, please set up a ChiselStrike backend, either locally or in the cloud.  If locally, please create/edit a `.env` file in the directory where `chiseld` runs and put the following line in it:
```json
{ "CHISELD_AUTH_SECRET" : "1234" }
```
If running a ChiselStrike backend in the cloud, please edit all instances of `new ChiselStrikeAdapter` in the `tests/` directory to reflect your backend's URL and auth secret.

Build and test:
```bash
cd next-auth/packages/adapter-chiselstrike/
pnpm test -- tests/basic.test.ts
pnpm test -- tests/custom.test.ts
```
(Unfortunately, the custom tests interfere with basic tests if run in parallel, so we run them separately.)

## License

ISC
