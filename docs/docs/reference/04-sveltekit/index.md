---
title: "index"
sidebar_label: "index"
sidebar_position: 0.5
---

# index

:::warning
`@auth/sveltekit` is currently experimental. The API _will_ change in the future.
:::

SvelteKit Auth is the official SvelteKit integration for Auth.js.
It provides a simple way to add authentication to your SvelteKit app in a few lines of code.

## Installation

```bash npm2yarn2pnpm
npm install @auth/core @auth/sveltekit
```

## Usage

```ts title="src/hooks.server.ts"
import { SvelteKitAuth } from "@auth/sveltekit"
import GitHub from "@auth/core/providers/github"
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

export const handle = SvelteKitAuth({
  providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
})
```

Don't forget to set the `AUTH_SECRET` [environment variable](https://kit.svelte.dev/docs/modules#$env-dynamic-private). This should be a minimum of 32 characters, random string. On UNIX systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.

When deploying your app outside Vercel, set the `AUTH_TRUST_HOST` variable to `true` for other hosting providers like Cloudflare Pages or Netlify.

The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you override [prefix](index.md#prefix):
```
[origin]/auth/callback/[provider]
```

## Signing in and signing out

The data for the current session in this example was made available through the `$page` store which can be set through the root `+page.server.ts` file.
It is not necessary to store the data there, however, this makes it globally accessible throughout your application simplifying state management.

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

## Managing the session

The above example checks for a session available in `$page.data.session`, however that needs to be set by us somewhere.
If you want this data to be available to all your routes you can add this to your root `+layout.server.ts` file.
The following code sets the session data in the `$page` store to be available to all routes.

```ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  return {
    session: await event.locals.getSession()
  };
};
```

What you return in the function `LayoutServerLoad` will be available inside the `$page` store, in the `data` property: `$page.data`.
In this case we return an object with the 'session' property which is what we are accessing in the other code paths.

## Handling authorization

In SvelteKit there are a few ways you could protect routes from unauthenticated users.

### Per component

The simplest case is protecting a single page, in which case you should put the logic in the `+page.server.ts` file.
Notice in this case that you could also await event.parent and grab the session from there, however this implementation works even if you haven't done the above in your root `+layout.server.ts`

```ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const session = await event.locals.getSession();
  if (!session?.user) throw redirect(303, '/auth');
  return {};
};
```

:::danger
Make sure to ALWAYS grab the session information from the parent instead of using the store in the case of a `PageLoad`.
Not doing so can lead to users being able to incorrectly access protected information in the case the `+layout.server.ts` does not run for that page load.
This code sample already implements the correct method by using `const { session } = await parent();`
:::

You should NOT put authorization logic in a `+layout.server.ts` as the logic is not guaranteed to propragate to leafs in the tree.
Prefer to manually protect each route through the `+page.server.ts` file to avoid mistakes.
It is possible to force the layout file to run the load function on all routes, however that relies certain behaviours that can change and are not easily checked.
For more information about these caveats make sure to read this issue in the SvelteKit repository: https://github.com/sveltejs/kit/issues/6315

### Per path

Another method that's possible for handling authorization is by restricting certain URIs from being available.
For many projects this is better because:
- This automatically protects actions and api routes in those URIs
- No code duplication between components
- Very easy to modify

The way to handle authorization through the URI is to override your handle hook.
The handle hook, available in `hooks.server.ts`, is a function that receives ALL requests sent to your SvelteKit webapp.
You may intercept them inside the handle hook, add and modify things in the request, block requests, etc.
Some readers may notice we are already using this handle hook for SvelteKitAuth which returns a handle itself, so we are going to use SvelteKit's sequence to provide middleware-like functions that set the handle hook.

```ts
import { SvelteKitAuth } from '@auth/sveltekit';
import GitHub from '@auth/core/providers/github';
import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

async function authorization({ event, resolve }) {
	// Protect any routes under /authenticated
	if (event.url.pathname.startsWith('/authenticated')) {
   const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/auth');
		}
	}

	// If the request is still here, just proceed as normally
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html
	});
	return result;
}

// First handle authentication, then authorization
// Each function acts as a middleware, receiving the request handle
// And returning a handle which gets passed to the next function
export const handle: Handle = sequence(
	SvelteKitAuth({
		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })]
	}),
	authorization
);
```

:::info
Learn more about SvelteKit's handle hooks and sequence [here](https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks-sequence).
:::

Now any routes under `/authenticated` will be transparently protected by the handle hook.
You may add more middleware-like functions to the sequence and also implement more complex authorization business logic inside this file.
This can also be used along with the component-based approach in case you need a specific page to be protected and doing it by URI could be faulty.

## Notes

:::info
Learn more about `@auth/sveltekit` [here](https://vercel.com/blog/announcing-sveltekit-auth).
:::

:::info
PRs to improve this documentation are welcome! See [this file](https://github.com/nextauthjs/next-auth/blob/main/packages/frameworks-sveltekit/src/lib/index.ts).
:::

## Functions

### SvelteKitAuth()

#### Signature

```ts
SvelteKitAuth(options: SvelteKitAuthConfig): Handle
```

The main entry point to `@auth/sveltekit`

#### See

https://sveltekit.authjs.dev

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [SvelteKitAuthConfig](index.md#sveltekitauthconfig) |

#### Returns

`Handle`

## Interfaces

### SvelteKitAuthConfig

Configure the [SvelteKitAuth](index.md#sveltekitauth) method.

#### Properties

##### providers

```ts
providers: Provider<Profile>[]
```

List of authentication providers for signing in
(e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
This can be one of the built-in providers or an object with a custom provider.

###### Default

[]

Inherited from: AuthConfig.providers

##### adapter

```ts
adapter?: Adapter
```

You can use the adapter option to pass in your database adapter.

Inherited from: AuthConfig.adapter

##### callbacks

```ts
callbacks?: Partial<CallbacksOptions<Profile, Account>>
```

Callbacks are asynchronous functions you can use to control what happens when an action is performed.
Callbacks are *extremely powerful*, especially in scenarios involving JSON Web Tokens
as they **allow you to implement access controls without a database** and to **integrate with external databases or APIs**.

Inherited from: AuthConfig.callbacks

##### cookies

```ts
cookies?: Partial<CookiesOptions>
```

You can override the default cookie names and options for any of the cookies used by NextAuth.js.
You can specify one or more cookies with custom properties,
but if you specify custom options for a cookie you must provide all the options for that cookie.
If you use this feature, you will likely want to create conditional behavior
to support setting different cookies policies in development and production builds,
as you will be opting out of the built-in dynamic policy.

- ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
but **may have complex implications** or side effects.
You should **try to avoid using advanced options** unless you are very comfortable using them.

###### Default

Inherited from: AuthConfig.cookies

##### debug

```ts
debug?: boolean
```

Set debug to true to enable debug messages for authentication and database operations.

- ⚠ If you added a custom AuthConfig.logger, this setting is ignored.

###### Default

false

Inherited from: AuthConfig.debug

##### events

```ts
events?: Partial<EventCallbacks>
```

Events are asynchronous functions that do not return a response, they are useful for audit logging.
You can specify a handler for any of these events below - e.g. for debugging or to create an audit log.
The content of the message object varies depending on the flow
(e.g. OAuth or Email authentication flow, JWT or database sessions, etc),
but typically contains a user object and/or contents of the JSON Web Token
and other information relevant to the event.

###### Default

Inherited from: AuthConfig.events

##### jwt

```ts
jwt?: Partial<JWTOptions>
```

JSON Web Tokens are enabled by default if you have not specified an AuthConfig.adapter.
JSON Web Tokens are encrypted (JWE) by default. We recommend you keep this behaviour.

Inherited from: AuthConfig.jwt

##### logger

```ts
logger?: Partial<LoggerInstance>
```

Override any of the logger levels (`undefined` levels will use the built-in logger),
and intercept logs in NextAuth. You can use this option to send NextAuth logs to a third-party logging service.

###### Example

```ts
// /pages/api/auth/[...nextauth].js
import log from "logging-service"
export default NextAuth({
  logger: {
    error(code, ...message) {
      log.error(code, message)
    },
    warn(code, ...message) {
      log.warn(code, message)
    },
    debug(code, ...message) {
      log.debug(code, message)
    }
  }
})
```

- ⚠ When set, the AuthConfig.debug option is ignored

###### Default

console

Inherited from: AuthConfig.logger

##### pages

```ts
pages?: Partial<PagesOptions>
```

Specify URLs to be used if you want to create custom sign in, sign out and error pages.
Pages specified will override the corresponding built-in page.

###### Default

###### Example

```ts
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user'
  }
```

Inherited from: AuthConfig.pages

##### prefix

```ts
prefix?: string
```

Defines the base path for the auth routes.
If you change the default value,
you must also update the callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers).

###### Default

"/auth"

##### secret

```ts
secret?: string
```

A random string used to hash tokens, sign cookies and generate cryptographic keys.
If not specified, it falls back to `AUTH_SECRET` or `NEXTAUTH_SECRET` from environment variables.
To generate a random string, you can use the following command:

On Unix systems: `openssl rand -hex 32`
Or go to https://generate-secret.vercel.app/32

Inherited from: AuthConfig.secret

##### session

```ts
session?: Partial<SessionOptions>
```

Configure your session like if you want to use JWT or a database,
how long until an idle session expires, or to throttle write operations in case you are using a database.

Inherited from: AuthConfig.session

##### theme

```ts
theme?: Theme
```

Changes the theme of built-in AuthConfig.pages.

Inherited from: AuthConfig.theme

##### trustHost

```ts
trustHost?: boolean
```

###### Todo

Inherited from: AuthConfig.trustHost

##### useSecureCookies

```ts
useSecureCookies?: boolean
```

When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
You can manually set this option to `false` to disable this security feature and allow cookies
to be accessible from non-secured URLs (this is not recommended).

- ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
but **may have complex implications** or side effects.
You should **try to avoid using advanced options** unless you are very comfortable using them.

The default is `false` HTTP and `true` for HTTPS sites.

Inherited from: AuthConfig.useSecureCookies
