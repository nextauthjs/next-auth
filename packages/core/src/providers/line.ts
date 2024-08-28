/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>LINE</b> integration.</span>
 * <a href="https://LINE.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/line.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/line
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface LineProfile extends Record<string, any> {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  amr: string[]
  name: string
  picture: string
  user: any
}

/**
 * Add LINE login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/line
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import LINE from "@auth/core/providers/line"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     LINE({ clientId: LINE_CLIENT_ID, clientSecret: LINE_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [LINE Login documentation](https://developers.line.biz/en/docs/line-login/integrate-line-login/)
 *  - [LINE app console](https://developers.line.biz/console/)
 *
 * ## Configuration
 * Create a provider and a LINE login channel at https://developers.line.biz/console/. In the settings of the channel under LINE Login, activate web app and configure the following: Callback URL `http://localhost:3000/api/auth/callback/line`
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the LINE provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * To retrieve email address, you need to apply for Email address permission. Open [Line Developer Console](https://developers.line.biz/console/), go to your Login Channel. Scroll down bottom to find **OpenID Connect** -> **Email address permission**. Click **Apply** and follow the instruction.
 *
 * :::
 *
 * :::tip
 *
 * The LINE provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/line.ts).
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
export default function LINE<P extends LineProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "line",
    name: "LINE",
    type: "oidc",
    issuer: "https://access.line.me",
    client: {
      id_token_signed_response_alg: "HS256",
    },
    style: { bg: "#00C300", text: "#fff" },
    options,
  }
}
