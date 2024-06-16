/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Mailru</b> integration.</span>
 * <a href="https://mail.ru">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/mailru.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/mailru
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Mailru login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/mailru
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Mailru from "@auth/core/providers/mailru"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Mailru({ clientId: MAILRU_CLIENT_ID, clientSecret: MAILRU_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Mailru OAuth documentation](https://o2.mail.ru/docs)
 *  - [Mailru app console](https://o2.mail.ru/app/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Mailru provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Mailru provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/ma.ts).
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
export default function Mailru(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "mailru",
    name: "Mail.ru",
    type: "oauth",
    authorization: "https://oauth.mail.ru/login?scope=userinfo",
    token: "https://oauth.mail.ru/token",
    userinfo: "https://oauth.mail.ru/userinfo",
    options: config,
  }
}
