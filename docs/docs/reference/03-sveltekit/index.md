---
title: SvelteKit
---

:::warning
`@auth/sveltekit` is currently experimental. 🏗
:::

## Installation

```bash npm2yarn2pnpm
npm install @auth/core @auth/sveltekit
```

## Usage

Learn more about `@auth/sveltekit` [here](https://vercel.com/blog/announcing-sveltekit-auth)

```ts title="src/hooks.server.ts"
import SvelteKitAuth from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })]
})
```

## Signing in and signing out

```ts
<script>
  import { signIn, signOut } from "@auth/sveltekit/client"
  import { page } from "$app/stores"
</script>

<h1>SvelteKit Auth Example</h1>
<p>
  {#if $page.data.session}
    {#if $page.data.session.user?.image}
      <span
        style="background-image: url('{$page.data.session.user.image}')"
        class="avatar"
      />
    {/if}
    <span class="signedInText">
      <small>Signed in as</small><br />
      <strong>{$page.data.session.user?.name ?? "User"}</strong>
    </span>
    <button on:click={() => signOut()} class="button">Sign out</button>
  {:else}
    <span class="notSignedInText">You are not signed in</span>
    <button on:click={() => signIn("github")}>Sign In with GitHub</button>
  {/if}
</p>
```




