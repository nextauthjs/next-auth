/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>DuendeIdentityServer6</b> integration.</span>
 * <a href="https://docs.duendesoftware.com/identityserver/v6">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/duende-identity-server6.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/duende-identity-server6
 */
import type { OAuthConfig, OAuthUserConfig } from "./oauth.js"

export interface DuendeISUser extends Record<string, any> {
  email: string
  id: string
  name: string
  verified: boolean
}

/**
 * Add DuendeIdentityServer6 login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/duende-identity-server6
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import DuendeIdentityServer6 from "@auth/core/providers/duende-identity-server6"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     DuendeIdentityServer6({
 *       clientId: DIS6_CLIENT_ID,
 *       clientSecret: DIS6_CLIENT_SECRET,
 *       issuer: DIS6_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [DuendeIdentityServer6 documentation](https://docs.duendesoftware.com/identityserver/v6)
 *
 * ### Notes
 *
 *
 * ## Demo IdentityServer
 *
 * The configuration below is for the demo server at https://demo.duendesoftware.com/
 *
 * If you want to try it out, you can copy and paste the configuration below.
 *
 * You can sign in to the demo service with either <b>bob/bob</b> or <b>alice/alice</b>.
 *
 * ```ts
 * import DuendeIdentityServer6 from "@auth/core/providers/duende-identity-server6"
 * providers: [
 *   DuendeIdentityServer6({
 *     clientId: "interactive.confidential",
 *     clientSecret: "secret",
 *     issuer: "https://demo.duendesoftware.com",
 *   })
 * ]
 * ```
 * By default, Auth.js assumes that the DuendeIdentityServer6 provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The DuendeIdentityServer6 provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/duende-identity-server6.ts).
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
export default function DuendeIdentityServer6<P extends DuendeISUser>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "duende-identity-server6",
    name: "DuendeIdentityServer6",
    type: "oidc",
    options,
  }
}
