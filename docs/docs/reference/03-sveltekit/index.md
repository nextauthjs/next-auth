---
title: SvelteKit
---

:::warning
`@auth/sveltekit` is currently experimental. 🏗
:::

## Installation

```bash npm2yarn2pnpm
npm install @auth/{core,sveltekit}
```

## Usage

```ts title="src/hooks.server.ts"
import SvelteKitAuth from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })]
})
```


