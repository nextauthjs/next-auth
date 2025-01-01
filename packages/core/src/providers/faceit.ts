/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>FACEIT</b> integration.</span>
 * <a href="https://faceit.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/faceit.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/faceit
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add FACEIT login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/faceit
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import FACEIT from "@auth/core/providers/faceit"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     FACEIT({ clientId: FACEIT_CLIENT_ID, clientSecret: FACEIT_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [FACEIT OAuth documentation](https://cdn.faceit.com/third_party/docs/FACEIT_Connect_3.0.pdf)
 *
 * ### Notes
 *
 * Grant type: Authorization Code
 * Scopes to have basic infos (email, nickname, guid and avatar) : openid, email, profile
 * By default, Auth.js assumes that the FACEIT provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The FACEIT provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/faceit.ts).
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
export default function FACEIT(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "faceit",
    name: "FACEIT",
    type: "oauth",
    authorization: "https://accounts.faceit.com/accounts?redirect_popup=true",
    // @ts-expect-error - TODO fix this
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${options.clientId}:${options.clientSecret}`
      ).toString("base64")}`,
    },
    token: "https://api.faceit.com/auth/v1/oauth/token",
    userinfo: "https://api.faceit.com/auth/v1/resources/userinfo",
    profile(profile) {
      return {
        id: profile.guid,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
