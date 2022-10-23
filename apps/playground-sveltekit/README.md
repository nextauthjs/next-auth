# SvelteKit + NextAuth.js Playground

NextAuth.js is committed to bringing easy authentication to other frameworks. https://github.com/nextauthjs/next-auth/issues/2294

SvelteKit support with NextAuth.js is currently experimental. This directory contains a minimal, proof-of-concept application. Parts of this is expected to be abstracted away into a package like `@next-auth/sveltekit`

## Running this Demo

- Copy `.env.example` to `.env`
- In `.env`, set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
  - See [https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app))
  - When creating the OAuth app, set "Homepage URL" to `http://localhost:5173` and Authorization callack URL to `http://localhost:5173/api/auth/callback/github`
- In `.env`, set `NEXTAUTH_SECRET` to any random string
- Build and run the application: `yarn build && yarn start`

## Existing Project

### Add API Route

To add NextAuth.js to a project create a file called `[...nextauth]/+server.js` in routes/api/auth. This contains the dynamic route handler for NextAuth.js which will also contain all of your global NextAuth.js configurations.

```ts
import { NextAuth, options } from "$lib/next-auth"

export const { GET, POST } = NextAuth(options)
```

### Add [hook](https://kit.svelte.dev/docs/hooks)

```ts
import type { Handle } from "@sveltejs/kit"
import { getServerSession, options as nextAuthOptions } from "$lib/next-auth"

export const handle: Handle = async function handle({
  event,
  resolve,
}): Promise<Response> {
  const session = await getServerSession(event.request, nextAuthOptions)
  event.locals.session = session

  return resolve(event)
}
```

### Load Session from Primary Layout

```ts
// src/lib/routes/+layout.server.ts
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = ({ locals }) => {
  return {
    session: locals.session,
  }
}
```

### Protecting a Route

```ts
// src/lib/routes/protected/+page.ts
import { redirect } from "@sveltejs/kit"
import type { PageLoad } from "./$types"

export const load: PageLoad = async ({ parent }) => {
  const { session } = await parent()
  if (!session?.user) {
    throw redirect(302, "/")
  }
  return {}
}
```

## Packaging lib

Refer to https://kit.svelte.dev/docs/packaging
