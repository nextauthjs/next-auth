/**
 * <div class="provider" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>SSOJet</b> integration.
 * </span>
 * <a href="https://ssojet.com" style={{backgroundColor: "#1a1a1a", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/ssojet.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/ssojet
 */
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** The returned user profile from SSOJet when using the profile callback. */
export interface SSOJetProfile extends Record<string, any> {
  /** The user's unique identifier. */
  sub: string
  /** The user's email address. */
  email: string
  /** Indicates whether the user has verified their email address. */
  email_verified: boolean
  /** The user's full name. */
  name: string
  /** The user's given name. */
  given_name: string
  /** The user's family name. */
  family_name: string
  /** URL pointing to the user's profile picture. */
  picture: string
  /** The user's preferred username. */
  preferred_username: string
  /** The user's locale. */
  locale: string
  /** The user's timezone. */
  zoneinfo: string
  /** Timestamp indicating when the user profile was last updated. */
  updated_at: number
}

/**
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/ssojet
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import SSOJet from "@auth/core/providers/ssojet"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     SSOJet({
 *       clientId: AUTH_SSOJET_CLIENT_ID,
 *       clientSecret: AUTH_SSOJET_CLIENT_SECRET,
 *       issuer: AUTH_SSOJET_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [SSOJet OIDC documentation](https://docs.ssojet.com/en/sso/quickstart/)
 * - [SSOJet NextAuth.js integration guide](https://docs.ssojet.com/en/sso/quickstart/fullstack/nextjs/)
 *
 * ### Notes
 *
 * The SSOJet provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/ssojet.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function SSOJet(
  config: OIDCUserConfig<SSOJetProfile>
): OIDCConfig<SSOJetProfile> {
  return {
    id: "ssojet",
    name: "SSOJet",
    type: "oidc",
    style: { text: "#fff", bg: "#1a1a1a" },
    options: config,
  }
}
