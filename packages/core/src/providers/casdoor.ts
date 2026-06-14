/**
 * <div class="provider" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Casdoor</b> integration.
 * </span>
 * <a href="https://casdoor.org" style={{backgroundColor: "#1772ff", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/casdoor.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/casdoor
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/**
 * The returned user profile from Casdoor when using the profile callback. Casdoor follows the
 * [OpenID Connect standard claims](https://www.iana.org/assignments/jwt/jwt.xhtml#claims) and may return custom fields.
 */
export interface CasdoorProfile extends Record<string, any> {
	sub: string
	name?: string
	preferred_username?: string
	email?: string
	email_verified?: boolean
	phone?: string
	picture?: string
}

/**
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/casdoor
 * ```
 *
 * #### Configuration
 * ```ts
 * import Casdoor from "@auth/core/providers/casdoor"
 * ...
 * providers: [
 *   Casdoor({
 *     clientId: env.AUTH_CASDOOR_ID,
 *     clientSecret: env.AUTH_CASDOOR_SECRET,
 *     issuer: env.AUTH_CASDOOR_ISSUER ?? "https://door.casdoor.com", // Your Casdoor instance
 *   }),
 * ]
 * ...
 * ```
 *
 * ### Resources
 *
 * - [Casdoor overview](https://casdoor.org/docs/overview)
 * - [Casdoor OpenID Connect API](https://door.casdoor.com/swagger/)
 * - [About OAuth in Auth.js](https://authjs.dev/concepts/oauth)
 *
 * ### Notes
 *
 * - Casdoor instances are self-hosted or cloud-hosted. Set the `issuer` to the base URL of the instance you manage (for example `https://door.casdoor.com`).
 * - Casdoor exposes the standard `.well-known/openid-configuration` metadata, so no additional endpoints need to be configured.
 * - Make sure the Redirect URI registered in Casdoor exactly matches the callback URL shown above.
 * - The Casdoor provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/casdoor.ts). To override the defaults, see [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Casdoor(
  options: OIDCUserConfig<CasdoorProfile>
): OIDCConfig<CasdoorProfile> {
  return {
    id: "casdoor",
    name: "Casdoor",
    type: "oidc",
    authorization: {
      params: {
        scope: "openid email profile phone",
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
