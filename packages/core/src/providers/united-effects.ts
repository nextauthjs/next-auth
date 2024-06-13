/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>United Effects</b> integration.</span>
 * <a href="https://www.unitedeffects.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/united-effects.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/united-effects
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"
export interface UnitedEffectsProfile extends Record<string, any> {
  sub: string
  email: string
}
/**
 * Add United Effects login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/united-effects
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import UnitedEffects from "@auth/core/providers/united-effects"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     UnitedEffects({ clientId: UE_CLIENT_ID, clientSecret: UE_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [UnitedEffects Auth.js documentation](https://docs.unitedeffects.com/integrations/nextauthjs)",
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the UnitedEffects provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::note
 *
 * `issuer` should be the fully qualified URL including your Auth Group ID – e.g. `https://auth.unitedeffects.com/YQpbQV5dbW-224dCovz-3`
 *
 * :::
 *
 * :::danger
 *
 * The United Effects API does not return the user name or image by design, so this provider will return null for both. United Effects prioritizes user personal information security above all and has built a secured profile access request system separate from the provider API.
 *
 * :::
 *
 * :::tip
 *
 * The UnitedEffects provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/united-effects.ts).
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
export default function UnitedEffects<P extends UnitedEffectsProfile>(
  options: OAuthUserConfig<P> & { issuer: string }
): OAuthConfig<P> {
  return {
    id: "united-effects",
    name: "United Effects",
    type: "oidc",
    authorization: {
      params: { scope: "openid email profile", resource: options.issuer },
    },
    options,
  }
}
