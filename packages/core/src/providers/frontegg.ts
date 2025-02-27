/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Frontegg</b> integration.
 * </span>
 * <a href="https://frontegg.com" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/frontegg.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/frontegg
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** The returned user profile from Frontegg when using the profile callback. [Reference](https://docs.frontegg.com/docs/admin-portal-profile). */
export interface FronteggProfile {
  /** The user's unique Frontegg ID */
  sub: string
  /** The user's name */
  name: string
  /** The user's email */
  email: string
  /** A boolean indicating if the user's email is verified */
  email_verified: boolean
  /** The user's picture */
  profilePictureUrl: string
  /** The user's roles */
  roles: string[]
  /** The user's custom attributes */
  [claim: string]: unknown
}

/**
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/frontegg
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Frontegg from "@auth/core/providers/frontegg"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Frontegg({
 *       clientId: AUTH_FRONTEGG_ID,
 *       clientSecret: AUTH_FRONTEGG_SECRET,
 *       issuer: AUTH_FRONTEGG_ISSUER
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Configuring Frontegg
 *
 * Follow these steps:
 *
 * Log into the [Frontegg portal](https://portal.frontegg.com)
 *
 * Authentication > Login method > Hosted login > Add your callback url here
 *
 * Then, create a `.env.local` file in the project root add the following entries:
 *
 * Get the following from the Frontegg's portal:
 * ```
 * AUTH_FRONTEGG_ID="<Client ID>" # Environments > Your environment > Env settings
 * AUTH_FRONTEGG_SECRET="<API KEY>" # Environments > Your environment > Env settings
 * AUTH_FRONTEGG_ISSUER="<https://[YOUR_SUBDOMAIN].frontegg.com>" # Environments > Your environment > Env settings > Domains > Domain name
 * ```
 *
 * ### Resources
 *
 * - [Frontegg Docs](https://docs.frontegg.com/docs/how-to-use-our-docs)
 *
 * ### Notes
 *
 * The Frontegg provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/frontegg.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::info
 * By default, Auth.js assumes that the Frontegg provider is based on the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) spec
 * :::
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Frontegg(
  options: OIDCUserConfig<FronteggProfile>
): OIDCConfig<FronteggProfile> {
  return {
    id: "frontegg",
    name: "Frontegg",
    type: "oidc",
    authorization: `${options.issuer}/oauth/authorize`,
    token: `${options.issuer}/oauth/token`,
    userinfo: `${options.issuer}/identity/resources/users/v2/me`,
    wellKnown: `${options.issuer}/oauth/.well-known/openid-configuration`,
    issuer: options.issuer,
    options,
  }
}
