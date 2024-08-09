/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Mailcow</b> integration.
 * </span>
 * <a href="https://mailcow.email" style={{backgroundColor: "#292A2E", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/mailcow.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/mailcow
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface MailcowProfile {
  id: "string"
  username: "string"
  identifier: "string"
  email: "string"
  full_name: "string"
  displayName: "string"
  created: "string"
  modified: "string"
  active: boolean
}

/**
 * Add Mailcow login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/mailcow
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Mailcow from "@auth/core/providers/mailcow"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Mailcow({
 *       clientId: MAILCOW_CLIENT_ID,
 *       clientSecret: MAILCOW_CLIENT_SECRET,
 *       baseUrl: MAILCOW_BASE_URL
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Mailcow - Use Mailcow as an OAuth 2 Provider](https://docs.mailcow.email/third_party/nextcloud/third_party-nextcloud/?h=oauth#configure-nextcloud-to-use-mailcow-for-authentication)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Mailcow provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Mailcow provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/mailcow.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
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
export default function Mailcow(
  config: OAuthUserConfig<MailcowProfile> & {
    baseUrl: string
  }
): OAuthConfig<MailcowProfile> {
  const baseUrl = config.baseUrl

  return {
    id: "mailcow",
    name: "Mailcow",
    type: "oauth",
    authorization: {
      url: `${baseUrl}/oauth/authorize`,
      params: { scope: "profile" },
    },
    token: `${baseUrl}/oauth/token`,
    checks: ["state"],
    userinfo: `${baseUrl}/oauth/profile`,
    profile(profile) {
      return { ...profile, name: profile.full_name }
    },
    style: { bg: "#292A2E", text: "#b1b1ba" },
    options: config,
  }
}