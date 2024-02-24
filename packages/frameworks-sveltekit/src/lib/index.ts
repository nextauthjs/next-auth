/**
 * :::warning
 * `@auth/sveltekit` is currently experimental. The API _might_ change.
 * :::
 *
 * SvelteKit Auth is the official SvelteKit integration for Auth.js.
 * It provides a simple way to add authentication to your SvelteKit app in a few lines of code.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/sveltekit
 * ```
 *
 * ## Usage
 *
 * ```ts title="src/auth.ts"
 *
 * import { SvelteKitAuth } from "@auth/sveltekit"
 * import GitHub from "@auth/sveltekit/providers/github"
 * import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"
 *
 * export const { handle, signIn, signOut } = SvelteKitAuth({
 *   providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
 * })
 * ```
 *
 * or to use SvelteKit platform environment variables for platforms like Cloudflare
 *
 * ```ts title="src/auth.ts"
 * import { SvelteKitAuth } from "@auth/sveltekit"
 * import GitHub from "@auth/sveltekit/providers/github"
 * import type { Handle } from "@sveltejs/kit";
 *
 * export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
 *   const authOptions = {
 *     providers: [GitHub({ clientId: event.platform.env.GITHUB_ID, clientSecret: event.platform.env.GITHUB_SECRET })]
 *     secret: event.platform.env.AUTH_SECRET,
 *     trustHost: true
 *   }
 *   return authOptions
 * }) satisfies Handle;
 * ```
 *
 * Re-export the handle in `src/hooks.server.ts`:
 * ```ts title="src/hooks.server.ts"
 * export { handle } from "./auth"
 * ```
 *
 * Remember to set the `AUTH_SECRET` [environment variable](https://kit.svelte.dev/docs/modules#$env-dynamic-private). This should be a minimum of 32 characters, random string. On UNIX systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.
 *
 * When deploying your app outside Vercel, set the `AUTH_TRUST_HOST` variable to `true` for other hosting providers like Cloudflare Pages or Netlify.
 *
 * The callback URL used by the [providers](https://authjs.dev/getting-started/providers) must be set to the following, unless you override {@link SvelteKitAuthConfig.basePath}:
 * ```
 * [origin]/auth/callback/[provider]
 * ```
 *
 * ## Signing in and signing out
 *
 * The data for the current session in this example was made available through the `$page` store which can be set through the root `+page.server.ts` file.
 * It is not necessary to store the data there, however, this makes it globally accessible throughout your application simplifying state management.
 *
 * ```ts
 * <script>
 *   import { SignIn, SignOut } from "@auth/sveltekit/components"
 *   import { page } from "$app/stores"
 * </script>
 *
 * <h1>SvelteKit Auth Example</h1>
 * <p>
 *   {#if $page.data.session}
 *     {#if $page.data.session.user?.image}
 *       <span
 *         style="background-image: url('{$page.data.session.user.image}')"
 *         class="avatar"
 *       />
 *     {/if}
 *     <span class="signedInText">
 *       <small>Signed in as</small><br />
 *       <strong>{$page.data.session.user?.name ?? "User"}</strong>
 *     </span>
 *     <SignOut />
 *   {:else}
 *     <span class="notSignedInText">You are not signed in</span>
 *     <SignIn provider="github"/>
 *     <SignIn provider="google"/>
 *     <SignIn provider="facebook"/>
 *   {/if}
 * </p>
 * ```
 *
 * `<SignIn />` and `<SignOut />` are components that `@auth/sveltekit` provides out of the box - they handle the sign-in/signout flow, and can be used as-is as a starting point or customized for your own components.
 * To set up the form actions, we need to define the files in `src/routes`:
 * ```ts title="src/routes/signin/+page.server.ts"
 * import { signIn } from "../../auth"
 * import type { Actions } from "./$types"
 * export const actions: Actions = { default: signIn }
 * ```
 * ```ts title="src/routes/signout/+page.server.ts"
 * import { signOut } from "../../auth"
 * import type { Actions } from "./$types"
 * export const actions: Actions = { default: signOut }
 * ```
 *
 * ## Managing the session
 *
 * The above example checks for a session available in `$page.data.session`, however that needs to be set by us somewhere.
 * If you want this data to be available to all your routes you can add this to `src/routes/+layout.server.ts`.
 * The following code sets the session data in the `$page` store to be available to all routes.
 *
 * ```ts
 * import type { LayoutServerLoad } from './$types';
 *
 * export const load: LayoutServerLoad = async (event) => {
 *   return {
 *     session: await event.locals.getSession()
 *   };
 * };
 * ```
 *
 * What you return in the function `LayoutServerLoad` will be available inside the `$page` store, in the `data` property: `$page.data`.
 * In this case we return an object with the 'session' property which is what we are accessing in the other code paths.
 *
 * ## Handling authorization
 *
 * In SvelteKit there are a few ways you could protect routes from unauthenticated users.
 *
 * ### Per component
 *
 * The simplest case is protecting a single page, in which case you should put the logic in the `+page.server.ts` file.
 * Notice in this case that you could also await event.parent and grab the session from there, however this implementation works even if you haven't done the above in your root `+layout.server.ts`
 *
 * ```ts
 * import { redirect } from '@sveltejs/kit';
 * import type { PageServerLoad } from './$types';
 *
 * export const load: PageServerLoad = async (event) => {
 *   const session = await event.locals.getSession();
 *   if (!session?.user) throw redirect(303, '/auth');
 *   return {};
 * };
 * ```
 *
 * :::danger
 * Make sure to ALWAYS grab the session information from the parent instead of using the store in the case of a `PageLoad`.
 * Not doing so can lead to users being able to incorrectly access protected information in the case the `+layout.server.ts` does not run for that page load.
 * This code sample already implements the correct method by using `const { session } = await parent();`
 * :::
 *
 * You should NOT put authorization logic in a `+layout.server.ts` as the logic is not guaranteed to propagate to leafs in the tree.
 * Prefer to manually protect each route through the `+page.server.ts` file to avoid mistakes.
 * It is possible to force the layout file to run the load function on all routes, however that relies certain behaviours that can change and are not easily checked.
 * For more information about these caveats make sure to read this issue in the SvelteKit repository: https://github.com/sveltejs/kit/issues/6315
 *
 * ### Per path
 *
 * Another method that's possible for handling authorization is by restricting certain URIs from being available.
 * For many projects this is better because:
 * - This automatically protects actions and api routes in those URIs
 * - No code duplication between components
 * - Very easy to modify
 *
 * The way to handle authorization through the URI is to override your handle hook.
 * The handle hook, available in `hooks.server.ts`, is a function that receives ALL requests sent to your SvelteKit webapp.
 * You may intercept them inside the handle hook, add and modify things in the request, block requests, etc.
 * Some readers may notice we are already using this handle hook for SvelteKitAuth which returns a handle itself, so we are going to use SvelteKit's sequence to provide middleware-like functions that set the handle hook.
 *
 * ```ts
 * import { SvelteKitAuth } from '@auth/sveltekit';
 * import GitHub from '@auth/sveltekit/providers/github';
 * import { GITHUB_ID, GITHUB_SECRET } from '$env/static/private';
 * import { redirect, type Handle } from '@sveltejs/kit';
 * import { sequence } from '@sveltejs/kit/hooks';
 *
 * async function authorization({ event, resolve }) {
 * 	// Protect any routes under /authenticated
 * 	if (event.url.pathname.startsWith('/authenticated')) {
 *    const session = await event.locals.getSession();
 * 		if (!session) {
 * 			throw redirect(303, '/auth');
 * 		}
 * 	}
 *
 * 	// If the request is still here, just proceed as normally
 * 	return resolve(event);
 * }
 *
 * // First handle authentication, then authorization
 * // Each function acts as a middleware, receiving the request handle
 * // And returning a handle which gets passed to the next function
 * export const handle: Handle = sequence(
 * 	SvelteKitAuth({
 * 		providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })]
 * 	}),
 * 	authorization
 * );
 * ```
 *
 * :::info
 * Learn more about SvelteKit's handle hooks and sequence [here](https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks-sequence).
 * :::
 *
 * Now any routes under `/authenticated` will be transparently protected by the handle hook.
 * You may add more middleware-like functions to the sequence and also implement more complex authorization business logic inside this file.
 * This can also be used along with the component-based approach in case you need a specific page to be protected and doing it by URI could be faulty.
 *
 * ## Notes
 *
 * :::info
 * Learn more about `@auth/sveltekit` [here](https://vercel.com/blog/announcing-sveltekit-auth).
 * :::
 *
 * :::info
 * PRs to improve this documentation are welcome! See [this file](https://github.com/nextauthjs/next-auth/blob/main/packages/frameworks-sveltekit/src/lib/index.ts).
 * :::
 *
 * @module @auth/sveltekit
 */

/// <reference types="@sveltejs/kit" />
import type { Action, Handle, RequestEvent } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"

import type { SvelteKitAuthConfig } from "./types"
import { setEnvDefaults } from "./env"
import { auth, signIn, signOut } from "./actions"
import { Auth, isAuthAction } from "@auth/core"

export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"

export type { SvelteKitAuthConfig }

const authorizationParamsPrefix = "authorizationParams-"

/**
 * The main entry point to `@auth/sveltekit`
 * @see https://sveltekit.authjs.dev
 */
export function SvelteKitAuth(
  config:
    | SvelteKitAuthConfig
    | ((event: RequestEvent) => PromiseLike<SvelteKitAuthConfig>)
): {
  handle: Handle
  signIn: Action
  signOut: Action
} {
  return {
    signIn: async (event) => {
      const { request } = event
      const _config = typeof config === "object" ? config : await config(event)
      setEnvDefaults(env, _config)
      const formData = await request.formData()
      const { providerId: provider, ...options } = Object.fromEntries(formData)
      // get the authorization params from the options prefixed with `authorizationParams-`
      let authorizationParams: Parameters<typeof signIn>[2] = {}
      let _options: Parameters<typeof signIn>[1] = {}
      for (const key in options) {
        if (key.startsWith(authorizationParamsPrefix)) {
          authorizationParams[key.slice(authorizationParamsPrefix.length)] =
            options[key] as string
        } else {
          _options[key] = options[key]
        }
      }
      await signIn(
        provider as string,
        _options,
        authorizationParams,
        _config,
        event
      )
    },
    signOut: async (event) => {
      const _config = typeof config === "object" ? config : await config(event)
      setEnvDefaults(env, _config)
      const options = Object.fromEntries(await event.request.formData())
      await signOut(options, _config, event)
    },
    async handle({ event, resolve }) {
      const _config = typeof config === "object" ? config : await config(event)
      setEnvDefaults(env, _config)

      const { url, request } = event

      event.locals.auth ??= () => auth(event, _config)
      event.locals.getSession ??= event.locals.auth

      const action = url.pathname
        .slice(
          // @ts-expect-error - basePath is defined in setEnvDefaults
          _config.basePath.length + 1
        )
        .split("/")[0]

      if (
        isAuthAction(action) &&
        url.pathname.startsWith(_config.basePath + "/")
      ) {
        return Auth(request, _config)
      }
      return resolve(event)
    },
  }
}
