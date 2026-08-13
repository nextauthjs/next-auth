/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Ory Hydra</b> integration.</span>
 * <a href="https://www.ory.sh/hydra/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/ory.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/ory-hydra
 */
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface OryProfile extends Record<string, any> {
  /** Issuer identifier - the URL of the identity provider that issued the token */
  iss: string
  /** Version of the token/claims */
  ver: string
  /** Audience - the intended recipient of the token (typically the client ID) */
  aud: string
  /** Issued at time - when the token was issued (Unix timestamp) */
  iat: string
  /** Expiration time - when the token expires (Unix timestamp) */
  exp: string
  /** JWT ID - a unique identifier for this token */
  jti: string
  /** Authentication Methods References - methods used to authenticate the user */
  amr: string
  /** The user's unique identifier. */
  sub: string
  /** The user's email address. */
  email?: string
  /** Indicates whether the user has verified their email address. */
  email_verified?: boolean
  /** The user's family name. */
  family_name?: string
  /** The user's given name. */
  given_name?: string
  /** The user's username. */
  username?: string
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
export default function OryHydra<P extends OryProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "ory",
    name: "Ory",
    type: "oidc",
    checks: ["pkce", "state"],
    idToken: true,
    style: {
      bg: "#fff",
      text: "#0F172A",
    },
    options,
  }
}
