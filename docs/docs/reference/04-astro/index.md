---
title: Astro Auth
---

Astro Auth is the official Auth.js implementation for Astro. 

It wraps the core Auth.js library for Astro, exposing helper methods and components to make it easy to add authentication to your app.

## Installation

Install the core Auth.js package as well as the @auth/astro wrapper.

:::info
The @auth/astro wrapper will not work independently, it relies on @auth/core as a dependency.
:::

```bash
npm install @auth/astro@latest @auth/core@latest
```

## Usage

### Requirements
- Node version `>= 19.x`
- Astro config set to output mode `server`

### Enable SSR in Your AstroJS Project

Initialize a new Astro project and enable server-side rendering.

Enabling server-side rendering within an Astro project requires a [deployment `adapter`](https://docs.astro.build/en/guides/deploy/) to be configured.

These settings can be configured within the `astro.config.mjs` file, located in the root of your project directory.

Example config:
```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone | middleware'
  }),
});
```

Resources:
- [Enabling SSR in Your Project](https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project)
- [Adding an Adapter](https://docs.astro.build/en/guides/server-side-rendering/#adding-an-adapter)

### Setup Environment Variables

Generate an auth secret by running `openssl rand -hex 32` in a local terminal or by visiting [generate-secret.vercel.app](https://generate-secret.vercel.app/32), copy the string, then set it as the `AUTH_SECRET` environment variable describe below.

#### Deploying to Vercel?
`AUTH_TRUST_HOST` can be set to false.

#### Deploying to another provider not named Vercel?
Set the `AUTH_TRUST_HOST` environment variable to `true` for hosting providers like Cloudflare Pages or Netlify.

```sh
AUTH_SECRET=<auth-secret>
AUTH_TRUST_HOST=true
```

### Create an AstroAuth Endpoint

No matter which provider(s) you use, you need to create one Astro [endpoint](https://docs.astro.build/en/core-concepts/endpoints/) that handles requests. 

Depending on the provider(s) you select, you will have to provide additional app credentials as environment variables within your `.env` file.

*App Credentials should be set as environment variables, and imported using `import.meta.env`.*

```ts title=".env"
AUTH_SECRET=<auth-secret>
AUTH_TRUST_HOST=<true | false>
...
GITHUB_ID=<github-oauth-clientID>
GITHUB_SECRET=<github-oauth-clientSecret>
```

```ts title="src/pages/api/auth/[...astroauth].ts"
import { AstroAuth, type AstroAuthConfig } from "@auth/astro"
import GitHub from "@auth/core/providers/github"

export const authOpts: AstroAuthConfig = {
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_ID,
      clientSecret: import.meta.env.GITHUB_SECRET,
    }),
  ]
}

export const { get, post } = AstroAuth(authOpts)
```
Some OAuth Providers request a callback URL be submitted alongside requesting a Client ID, and Client Secret. 
The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you override the `prefix` field in `authOpts`:
```
[origin]/api/auth/callback/[provider]

// example
// http://localhost:3000/api/auth/callback/github
```



## Sign in & Sign out

Astro Auth exposes two ways to sign in and out. Inline scripts and Astro Components.

### With Inline script tags

The `signIn` and `signOut` methods can be imported dynamically in an inline script.

```html
---
---
<html>
<body>
  <button id="login">Login</button>
  <button id="logout">Logout</button>

  <script>
    let { signIn, signOut } = await import("@auth/astro/client")
    document.querySelector("#login").onclick = () => signIn("github")
    document.querySelector("#logout").onclick = () => signOut()
  </script>
</body>
</html>
```
### With @auth/astro's Components

Alternatively, you can use the `SignIn` and `SignOut` button components provided by `@auth/astro/components` importing them into your Astro [component's script](https://docs.astro.build/en/core-concepts/astro-components/#the-component-script) 

```jsx
---
import { SignIn, SignOut } from '@auth/astro/components'
---
<html>
  <body>
    ...
    <SignIn provider="github" />
    <SignOut />
    ...
  </body>
</html>
```

## Fetching the session

You can fetch the session in one of two ways. The `getSession` method can be used in the component script section to fetch the session.

### Within the component script section

```tsx title="src/pages/index.astro"
---
import { getSession } from '@astro/auth';
import { authOpts } from './api/auth/[...astroauth]';

const session = await getSession(Astro.request, authOpts)
---
{session ? (
  <p>Welcome {session.user?.name}</p>
) : (
  <p>Not logged in</p>
)}
```
### Within the Auth component

Alternatively, you can use the `Auth` component to fetch the session using a render prop.

```tsx title="src/pages/index.astro"
---
import type { Session } from '@auth/core/types';
import { Auth, Signin, Signout } from '@auth/astro/components';
import { authOpts } from './api/auth/[...astroAuth]'
---
<Auth authOpts={authOpts}>
  {(session: Session) => 
    {session ? 
      <Signin provider="github">Login</Signin>
    :
      <Signout>Logout</Signout>
    }

    <p>
      {session ? `Logged in as ${session.user?.name}` : 'Not logged in'}
    </p>
  }
</Auth>
```
