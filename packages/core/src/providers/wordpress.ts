import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add WordPress login to your page.
 *
 * @example
 *
 * ```js
 * import Auth from "@auth/core"
 * import WordPress from "@auth/core/providers/wordpress"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [WordPress({ clientId: WORKPRESS_CLIENT_ID, clientSecret: WORKPRESS_CLIENT_SECRET })],
 * })
 * ```
 *
 * ## Resources
 *
 * - [WordPress OAuth documentation](https://developer.wordpress.com/docs/oauth2/)
 *
 * ## Notes
 *
 * By default, Auth.js assumes that the WordPress provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The WordPress provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/wordpress.ts).
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
export default function WordPress(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "wordpress",
    name: "WordPress.com",
    type: "oauth",
    authorization:
      "https://public-api.wordpress.com/oauth2/authorize?scope=auth",
    token: "https://public-api.wordpress.com/oauth2/token",
    userinfo: "https://public-api.wordpress.com/rest/v1/me",
    profile(profile) {
      return {
        id: profile.ID,
        name: profile.display_name,
        email: profile.email,
        image: profile.avatar_URL,
      }
    },
    options: config,
  }
}
