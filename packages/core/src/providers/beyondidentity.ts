/**
 * <div class="provider" style={{backgroundColor: "#5077c5", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Beyond Identity</b> integration.</span>
 * <a href="https://www.beyondidentity.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/beyondidentity.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/beyondidentity
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** @see [Beyond Identity Developer Docs](https://developer.beyondidentity.com/) */
export interface BeyondIdentityProfile {
  /** The user's unique identifier. */
  sub: string
  /** The user's full name. */
  name: string
  /** The user's preferred username. */
  preferred_username: string
  /** The user's email address. */
  email: string
}

/**
 * Add Beyond Identity login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/beyondidentity
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import BeyondIdentity from "@auth/core/providers/beyondidentity"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     BeyondIdentity({
 *       clientId: BEYOND_IDENTITY_CLIENT_ID,
 *       clientSecret: BEYOND_IDENTITY_CLIENT_SECRET,
 *       issuer: BEYOND_IDENTITY_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Beyond Identity Developer Docs](https://developer.beyondidentity.com/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the BeyondIdentity provider is
 * based on the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The BeyondIdentity provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/beyondidentity.ts).
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

export default function BeyondIdentity(
  config: OIDCUserConfig<BeyondIdentityProfile>
): OIDCConfig<BeyondIdentityProfile> {
  return {
    id: "beyondidentity",
    name: "Beyond Identity",
    type: "oidc",
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        image: null,
        preferred_username: profile.preferred_username,
      }
    },
    style: {
      bg: "#5077c5",
      text: "#fff",
    },
    options: config,
  }
}
