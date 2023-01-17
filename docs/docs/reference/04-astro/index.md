---
title: Astro Auth
---

Astro Auth is the official Auth.js implementation for Astro. It wraps the core library, exposing helper methods and components to make it easy to add authentication to your app.

## Installation

```bash
npm install @auth/astro@latest @auth/core@latest
```

## Usage

To accept authentication request, no matter which provider(s) you use, you need to create an [endpoint](https://docs.astro.build/en/core-concepts/endpoints/) that handles requests. Depending on the provider, you will have to provide different app credentials. These should be set as environment variables, and imported using `import.meta.env`.

```ts title="src/pages/api/auth/[...astroauth].ts"
import { AstroAuth, type AstroAuthConfig } from "@auth/astro"
import GitHub from "@auth/core/providers/github"

export const authOpts: AstroAuthConfig = {
  providers: [
    // @ts-ignore
    GitHub({
      clientId: import.meta.env.GITHUB_ID,
      clientSecret: import.meta.env.GITHUB_SECRET,
    }),
  ],
  trustHost: true,
}

export const { get, post } = AstroAuth(authOpts)
```

The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you override the `prefix` field in `authOpts`:
```
[origin]/api/auth/callback/[provider]
```

When deploying your app outside Vercel, set the `AUTH_TRUST_HOST` variable to `true` for other hosting providers like Cloudflare Pages or Netlify.


## Auth Secret

Generate an auth secret by running `openssl rand -hex 32` or checking out [generate-secret.vercel.app](https://generate-secret.vercel.app/32), then set it as an environment variable:

```sh
AUTH_SECRET=<auth-secret>
```

## Sign in & Sign out

Astro Auth exposes two ways to sign in and out. The `signIn` and `signOut` methods can be imported dynamically in an inline script.

```html
<button id="login">Login</button>
<button id="logout">Logout</button>

<script>
  let { signIn, signOut } = await import("@auth/astro/client")
  document.querySelector("#login").onclick = () => signIn("github")
  document.querySelector("#logout").onclick = () => signOut()
</script>
```

Alternatively, you can use the `SignIn` and `SignOut` button components.

```html
<SignIn provider="github" />
<SignOut />
```

## Fetching the session

You can fetch the session in one of two ways. The `getSession` method can be used in the [component script](https://docs.astro.build/en/core-concepts/astro-components/#the-component-script) to fetch the session.

```tsx title="src/pages/index.astro"
---
import { type AstroAuthConfig, getSession } from '@astro/auth';
import { authOpts } from './api/auth/[...astroauth]';

const session = await getSession(Astro.request, authOpts)
---
{session ? (
  <p>Welcome {session.user?.name}</p>
) : (
  <p>Not logged in</p>
)}
```

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
