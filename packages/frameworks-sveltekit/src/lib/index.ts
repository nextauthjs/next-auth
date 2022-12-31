/**
 *
 *
 * :::warning
 * `@auth/sveltekit` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * SvelteKit Auth is the official SvelteKit integration for Auth.js.
 * It provides a simple way to add authentication to your SvelteKit app in a few lines of code.
 *
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/core @auth/sveltekit
 * ```
 *
 * ## Usage
 *
 * ```ts title="src/hooks.server.ts"
 * import SvelteKitAuth from "@auth/sveltekit"
 * import GitHub from "@auth/core/providers/github"
 * import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"
 *
 * export const handle = SvelteKitAuth({
 *   providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
 * })
 * ```
 *
 * Don't forget to set the `AUTH_SECRET` [environment variable](https://kit.svelte.dev/docs/modules#$env-static-private). This should be a random 32 character string. On unix systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.
 *
 * When deploying your app outside Vercel, set the `AUTH_TRUST_HOST` variable to `true` for other hosting providers like Cloudflare Pages or Netlify.
 *
 * The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you override {@link SvelteKitAuthConfig.prefix}:
 * ```
 * [origin]/auth/callback/[provider]
 * ```
 *
 * ## Signing in and signing out
 *
 * ```ts
 * <script>
 *   import { signIn, signOut } from "@auth/sveltekit/client"
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
 *     <button on:click={() => signOut()} class="button">Sign out</button>
 *   {:else}
 *     <span class="notSignedInText">You are not signed in</span>
 *     <button on:click={() => signIn("github")}>Sign In with GitHub</button>
 *   {/if}
 * </p>
 * ```
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
 * @module main
 */

/// <reference types="@sveltejs/kit" />
import type { Handle } from "@sveltejs/kit"

import { dev } from "$app/environment"
import { env } from "$env/dynamic/private"
import { AUTH_SECRET } from "$env/static/private"

import { Auth } from "@auth/core"
import type { AuthAction, AuthConfig, Session } from "@auth/core/types"

export async function getSession(
  req: Request,
  config: AuthConfig
): ReturnType<App.Locals["getSession"]> {
  config.secret ??= AUTH_SECRET
  config.trustHost ??= true

  const url = new URL("/api/auth/session", req.url)
  const request = new Request(url, { headers: req.headers })
  const response = await Auth(request, config)

  const { status = 200 } = response
  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}

/** Configure the {@link SvelteKitAuth} method. */
export interface SvelteKitAuthConfig extends AuthConfig {
  /**
   * Defines the base path for the auth routes.
   * If you change the default value,
   * you must also update the callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers).
   *
   * @default "/auth"
   */
  prefix?: string
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]

function AuthHandle(prefix: string, authOptions: AuthConfig): Handle {
  return function ({ event, resolve }) {
    const { url, request } = event

    event.locals.getSession ??= () => getSession(request, authOptions)

    const action = url.pathname
      .slice(prefix.length + 1)
      .split("/")[0] as AuthAction

    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
      return resolve(event)
    }

    return Auth(request, authOptions)
  }
}

/**
 * The main entry point to `@auth/sveltekit`
 * @see https://sveltekit.authjs.dev
 */
export function SvelteKitAuth(options: SvelteKitAuthConfig): Handle {
  const { prefix = "/auth", ...authOptions } = options
  authOptions.secret ??= AUTH_SECRET
  authOptions.trustHost ??= !!(env.AUTH_TRUST_HOST ?? env.VERCEL ?? dev)
  return AuthHandle(prefix, authOptions)
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace App {
    interface Locals {
      getSession(): Promise<Session | null>
    }
    interface PageData {
      session: Session | null
    }
  }
}

declare module "$env/dynamic/private" {
  export const AUTH_TRUST_HOST: string
  export const VERCEL: string
}

declare module "$env/static/private" {
  export const AUTH_SECRET: string
}
