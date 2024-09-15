/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Descope</b> integration.
 * </span>
 * <a href="https://descope.com" style={{backgroundColor: "#000000", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/descope.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/descope
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** The returned user profile from Descope when using the profile callback.
 * [See Load User](https://docs.descope.com/api/openapi/usermanagement/operation/LoadUser/)
 */
export interface DescopeProfile {
  /** The user's unique Descope ID */
  sub: string
  /** The user's name */
  name: string
  /** The user's email */
  email: string
  /** A boolean indicating if the user's email is verified */
  email_verified: boolean
  /** The user's phone number */
  phone_number: string
  /** A boolean indicating if the user's phone number is verified */
  phone_number_verified: boolean
  /** The user's picture */
  picture: string
  /** The user's custom attributes */
  [claim: string]: unknown
}

/**
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/descope
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Descope from "@auth/core/providers/descope"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, { providers: [Descope({ clientId: AUTH_DESCOPE_ID, clientSecret: AUTH_DESCOPE_SECRET, issuer: AUTH_DESCOPE_ISSUER })] })
 * ```
 *
 * ### Configuring Descope
 *
 * Follow these steps:
 *
 * 1. Log into the [Descope console](https://app.descope.com)
 * 2. Follow the [OIDC instructions](https://docs.descope.com/customize/auth/oidc)
 *
 * Then, create a `.env.local` file in the project root add the following entries:
 *
 * Get the following from the Descope's console:
 * ```
 * AUTH_DESCOPE_ID="<Descope Issuer's last url segment>" # Descope's Issuer can be found in "Authentication Methods > SSO > Identity Provider" (Can also be taken from "Project > Project ID")
 * AUTH_DESCOPE_SECRET="<Descope Access Key>" # Manage > Access Keys
 * AUTH_DESCOPE_ISSUER="<Descope Issuer URL>" # Applications -> OIDC Application -> Issuer
 * ```
 *
 * ### Resources
 *
 * - [Descope OIDC](https://docs.descope.com/customize/auth/oidc)
 * - [Descope Flows](https://docs.descope.com/customize/flows)
 *
 * ### Notes
 *
 * The Descope provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/descope.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::info
 * By default, Auth.js assumes that the Descope provider is based on the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) spec
 * :::
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Descope(
  config: OIDCUserConfig<DescopeProfile>
): OIDCConfig<DescopeProfile> {
  config.issuer ??= `https://api.descope.com/${config.clientId}`
  return {
    id: "descope",
    name: "Descope",
    type: "oidc",
    style: { bg: "#1C1C23", text: "#ffffff" },
    checks: ["pkce", "state"],
    options: config,
  }
}
