<p align="center">
	 <br/>
	 <a href="https://next-auth.js.org" target="_blank">
		<img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a><img height="64px" src="./logo.svg" />
	 <h3 align="center"><b>Supabase Adapter</b> - NextAuth.js</h3>
	 <p align="center">
	 Open Source. Full Stack. Own Your Data.
	 </p>
	 <p align="center" style="align: center;">
			<img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg?branch=main" alt="Build Test" />
			<img src="https://img.shields.io/bundlephobia/minzip/@next-auth/supabase-adapter/latest" alt="Bundle Size"/>
			<img src="https://img.shields.io/npm/v/@next-auth/supabase-adapter" alt="@next-auth/supabase-adapter Version" />
	 </p>
</p>

## Overview

This is the Supabase Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

You can find more Supabase information in the docs at [next-auth.js.org/adapters/supabase](https://next-auth.js.org/adapters/supabase).

## Getting Started

1. Install `@supabase/supabase-js`, `next-auth` and `@next-auth/supabase-adapter`.

```js
npm install @supabase/supabase-js next-auth @next-auth/supabase-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://providers.authjs.dev
  providers: [
    // ...
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  // ...
})
```

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please read our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/main/CONTRIBUTING.md).

## License

ISC
