---
id: supabase
title: Supabase
---

# Supabase

This is the Supabase Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install `@supabase/supabase-js`, `next-auth` and `@next-auth/supabase-adapter`.

```bash npm2yarn2pnpm
npm install @supabase/supabase-js next-auth @next-auth/supabase-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```js
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [
    // ...
  ],
  adapter: SupabaseAdapter(supabase),
  // ...
})
```
