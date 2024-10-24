/**
 * <div class="provider" style={{backgroundColor: "#00a1e0", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Salesforce</b> integration.</span>
 * <a href="https://www.salesforce.com/ap/?ir=1">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/salesforce.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/salesforce
 */
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface SalesforceProfile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

/**
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/salesforce
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Salesforce from "@auth/core/providers/salesforce"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Salesforce({
 *       clientId: AUTH_SALESFORCE_ID,
 *       clientSecret: AUTH_SALESFORCE_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Auth0 docs](https://auth0.com/docs/authenticate)
 *
 * ### Notes
 *
 * The Salesforce provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/salesforce.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Salesforce(
  options: OIDCUserConfig<SalesforceProfile>
): OIDCConfig<SalesforceProfile> {
  return {
    id: "salesforce",
    name: "Salesforce",
    type: "oidc",
    issuer: "https://login.salesforce.com",
    idToken: false,
    checks: ["pkce", "state", "nonce"],
    style: { bg: "#00a1e0" },
    options,
  }
}
