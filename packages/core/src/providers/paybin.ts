/**
 * <div class="provider" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Paybin</b> integration.
 * </span>
 * <a href="https://paybin.io" style={{backgroundColor: "#000", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/paybin.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/paybin
 */
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/**
 * The returned user profile from Paybin when using the profile callback.
 * [Reference](https://idp.paybin.io/.well-known/openid-configuration)
 */
export interface PaybinProfile extends Record<string, any> {
  /** The user's unique identifier. */
  sub: string
  /** The user's email address. */
  email: string
  /** Indicates whether the user has verified their email address. */
  email_verified?: boolean
  /** The user's full name. */
  name?: string
  /** The user's username. */
  preferred_username?: string
  /** URL pointing to the user's profile picture. */
  picture?: string
  /** The user's given name. */
  given_name?: string
  /** The user's family name. */
  family_name?: string
}

/**
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/paybin
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Paybin from "@auth/core/providers/paybin"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Paybin({
 *       clientId: PAYBIN_CLIENT_ID,
 *       clientSecret: PAYBIN_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Paybin OAuth documentation](https://developers.paybin.io/knowledge-center/oidc)
 * - [Paybin OIDC configuration](https://idp.paybin.io/.well-known/openid-configuration)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Paybin provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * The Paybin provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/paybin.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Paybin<P extends PaybinProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "paybin",
    name: "Paybin",
    type: "oidc",
    issuer: "https://idp.paybin.io",
    style: { text: "#fff", bg: "#000" },
    options,
  }
}
