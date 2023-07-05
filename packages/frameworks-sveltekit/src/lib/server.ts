import type {
  LiteralUnion,
  SignInOptions,
  SignInAuthorizationParams,
  SignOutParams,
} from "next-auth/react"
import type {
  BuiltInProviderType,
  RedirectableProviderType,
} from "@auth/core/providers"

import { type Fetch, makeSignInRequest, makeSignOutRequest } from "./common"

/**
 * Server-side method to initiate a signin flow
 * or send the user to the signin page listing all possible providers.
 * Automatically adds the CSRF token to the request.
 *
 * [Documentation](https://authjs.dev/reference/sveltekit/server#signin)
 *
 * @param fetch `fetch` implementation likely provided as {@link https://kit.svelte.dev/docs/types#public-types-requestevent `RequestEvent.fetch`}
 * @param providerId user will be taken to page listing all providers if `providerId` not given
 * @param options provide options like a `callbackUrl` to redirect to after sign-in
 * @param authorizationParams URL search params that will be sent to the `/auth` endpoints created by `Auth.js`
 *
 * @return If `options.redirect` is **not** `false` and `providerId` is **not** either `'email'` or `'credentials'`, returns `Promise`<{ `location`: `string`; }>.
 *
 * Otherwise, returns `Promise`<{ `response`: `Response` }>
 */
export async function signIn<
  P extends RedirectableProviderType | undefined = undefined
>(
  fetch: Fetch,
  providerId?: LiteralUnion<
    P extends RedirectableProviderType
      ? P | BuiltInProviderType
      : BuiltInProviderType
  >,
  options?: SignInOptions,
  authorizationParams?: SignInAuthorizationParams
): Promise<
  | { location: string; response?: never }
  | { location?: never; response: Response }
> {
  const { res, data, shouldRedirect, isSupportingReturn, callbackUrl } =
    await makeSignInRequest(
      fetch,
      "/",
      providerId,
      options,
      authorizationParams
    )

  if (shouldRedirect || !isSupportingReturn) {
    return { location: data.url ?? callbackUrl }
  }

  return { response: res }
}

/**
 * Signs the user out by removing the session cookie.
 * Automatically adds the CSRF token to the request.
 *
 * Note that this only ends the Auth.js-maintained browser session.
 * Many OIDC/OAuth providers maintain their own sessions (for example, linked to IP addresses to silently re-authenticate without re-entering credentials)
 * that may require a separate, manual request or confirmation to terminate.
 * [See keycloak's logout endpoint](https://www.keycloak.org/docs/latest/securing_apps/index.html#logout-endpoint) for example.
 *
 * [Documentation](https://authjs.dev/reference/sveltekit/server#signout)
 */
export async function signOut(
  fetch: Fetch,
  options?: SignOutParams
): Promise<string> {
  const { data, callbackUrl } = await makeSignOutRequest(fetch, "/", options)

  return data.url ?? callbackUrl
}
