import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Zoho login to your page.
 *
 * @example
 *
 * ```js
 * import Auth from "@auth/core"
 * import Zoho from "@auth/core/providers/zoho"
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, {
 *   providers: [Zoho({ clientId: "", clientSecret: "" })],
 * })
 * ```
 *
 * ## Resources
 *
 * @see [Zoho OAuth 2.0 Integration Guide](https://www.zoho.com/accounts/protocol/oauth/web-server-applications.html)
 * @see [Zoho API Console](https://api-console.zoho.com)
 *
 * ## Notes
 *
 * By default, Auth.js assumes that the Zoho provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Zoho provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/zoho.ts).
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
export default function Zoho(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "zoho",
    name: "Zoho",
    type: "oauth",
    authorization:
      "https://accounts.zoho.com/oauth/v2/auth?scope=AaaServer.profile.Read",
    token: "https://accounts.zoho.com/oauth/v2/token",
    userinfo: "https://accounts.zoho.com/oauth/user/info",
    profile(profile) {
      return {
        id: profile.ZUID,
        name: `${profile.First_Name} ${profile.Last_Name}`,
        email: profile.Email,
        image: null,
      }
    },
    options: config,
  }
}
