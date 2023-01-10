/**
 * <div style={{backgroundColor: "#EB5424", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Auth0</b> integration.</span>
 * <a href="https://auth0.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/auth0-dark.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * ---
 * @module providers/auth0
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** @see [User Profile Structure](https://auth0.com/docs/manage-users/user-accounts/user-profiles/user-profile-structure) */
export interface Auth0Profile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

/**
 * Add Auth0 login to your page.
 *
 * ## Example
 *
 * @example
 *
 * ```js
 * import { Auth } from "@auth/core"
 * import Auth0 from "@auth/core/providers/auth0"
 *
 * const request = new Request("https://example.com")
 * const resposne = await Auth(request, {
 *   providers: [Auth0({ clientId: "", clientSecret: "", issuer: "" })],
 * })
 * ```
 *
 * ---
 *
 * ## Resources
 *
 * @see [Link 1](https://example.com)
 *
 * ---
 *
 * ## Notes
 *
 * By default, Auth.js assumes that the Auth0 provider is
 * based on the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The Auth0 provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/auth0.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */

export default function Auth0<P extends Auth0Profile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "auth0",
    name: "Auth0",
    type: "oidc",
    style: {
      logo: "/auth0.svg",
      logoDark: "/auth0-dark.svg",
      bg: "#fff",
      text: "#EB5424",
      bgDark: "#EB5424",
      textDark: "#fff",
    },
    options,
  }
}
