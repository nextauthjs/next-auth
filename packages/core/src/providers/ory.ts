/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Ory</b> integration.</span>
 * <a href="https://www.ory.sh/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/ory.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/ory
 */
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface DefaultOryProfile extends Record<string, any> {
  iss: string
  ver: string
  sub: string
  aud: string
  iat: string
  exp: string
  jti: string
  amr: string
  email?: string
  email_verified?: boolean
  preferred_username?: string
  website?: string
  given_name?: string
  family_name?: string
  name?: string
  updated_at?: Date
}

/**
 * Add login with Ory to your app.
 *
 * ### Setup
 *
 * #### Callback URL
 *
 * ```
 * https://example.com/api/auth/callback/ory
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Ory from "@auth/core/providers/ory"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Ory({
 *     clientId: ORY_CLIENT_ID,
 *     clientSecret: ORY_CLIENT_SECRET,
 *     issuer: ORY_SDK_URL // https://ory.yourdomain.com
 *   })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Ory + Auth.js integration](https://www.ory.sh/docs/getting-started/integrate-auth/auth-js)
 *  - [Ory Documentation](https://www.ory.sh/docs)
 *
 * ### Notes
 *
 * This set up is optimized for Ory Network, a managed service by Ory. To use Auth.js with self-hosted Ory Hydra, use the `OryHydra` provider.
 *
 * The Ory integration is based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The Ory provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/ory.ts).
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
export default function Ory<P extends DefaultOryProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "ory",
    name: "Ory",
    type: 'oidc',
    checks: ["pkce", "state", "nonce"],
    style: {
      bg: "#fff",
      text: "#0F172A",
    },
    options,
  }
}
