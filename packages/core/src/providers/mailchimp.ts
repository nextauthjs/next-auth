/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Mailchimp</b> integration.</span>
 * <a href="https://mailchimp.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/mailchimp.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/mailchimp
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Mailchimp login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/mailchimp
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Mailchimp from "@auth/core/providers/mailchimp"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Mailchimp({
 *       clientId: MAILCHIMP_CLIENT_ID,
 *       clientSecret: MAILCHIMP_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Mailchimp OAuth documentation](https://admin.mailchimp.com/account/oauth2/client/)
 *  - [Mailchimp documentation: Access user data](https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Mailchimp provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Mailchimp provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/mailchimp.ts).
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
export default function Mailchimp(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "mailchimp",
    name: "Mailchimp",
    type: "oauth",
    authorization: "https://login.mailchimp.com/oauth2/authorize",
    token: "https://login.mailchimp.com/oauth2/token",
    userinfo: "https://login.mailchimp.com/oauth2/metadata",
    profile(profile) {
      return {
        id: profile.login.login_id,
        name: profile.accountname,
        email: profile.login.email,
        image: null,
      }
    },
    style: {
      bg: "#000",
      text: "#fff",
    },
    options: config,
  }
}
