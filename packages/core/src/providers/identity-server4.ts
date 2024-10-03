/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>IdentityServer4</b> integration.</span>
 * <a href="https://identityserver4.readthedocs.io">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/identity-server4.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/identity-server4
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add IdentityServer4 login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/identity-server4
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import IdentityServer4 from "@auth/core/providers/identity-server4"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     IdentityServer4({
 *       clientId: IDENTITY_SERVER4_CLIENT_ID,
 *       clientSecret: IDENTITY_SERVER4_CLIENT_SECRET,
 *       issuer: IDENTITY_SERVER4_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [IdentityServer4 OAuth documentation](https://identityserver4.readthedocs.io/en/latest/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the IdentityServer4 provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::warning
 * IdentityServer4 is discontinued and only releases security updates until November 2022. You should consider an alternative provider.
 * :::
 * :::tip
 *
 * The IdentityServer4 provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/identity-server4.ts).
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
export default function IdentityServer4(
  options: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oidc",
    options,
  }
}
