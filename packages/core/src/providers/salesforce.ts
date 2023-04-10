/**
 * Add Salesforce login to your page.
 *
 * ## Example
 *
 * ```ts
 * import { Auth } from "@auth/core"
 * import Salesforce from "@auth/core/providers/salesforce"
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, {
 *   providers: [Salesforce({ clientId: "", clientSecret: "" })],
 * })
 * ```
 *
 * ---
 *
 * ## Resources
 *
 * - [](https://example.com)
 *
 * ---
 *
 * ## Notes
 *
 * By default, Auth.js assumes that the Salesforce provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Salesforce provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/.ts).
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
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface SalesforceProfile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

export default function Salesforce<P extends SalesforceProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const { issuer = "https://login.salesforce.com" } = options
  return {
    id: "salesforce",
    name: "Salesforce",
    type: "oauth",
    authorization: `${issuer}/services/oauth2/authorize?display=page`,
    token: `${issuer}/services/oauth2/token`,
    userinfo: `${issuer}/services/oauth2/userinfo`,
    profile(profile) {
      return {
        id: profile.user_id,
        name: null,
        email: null,
        image: profile.picture,
      }
    },
    options,
  }
}
