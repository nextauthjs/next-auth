/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Logto</b> integration.
 * </span>
 * <a href="https://logto.io" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/logto.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/logto
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** The returned user profile from Logto when using the profile callback. [Reference](https://docs.logto.io/quick-starts/next-auth#scopes-and-claims). */
export interface LogtoProfile {
  /** The user's unique ID */
  sub: string
  /** The user's name */
  name: string
  /** The user's username */
  username: string
  /** The user's picture */
  picture: string
  /** The user's email */
  email: string
  /** A boolean indicating if the user's email is verified */
  email_verified: boolean
  /** The user's phone number */
  phone_number: string
  /** A boolean indicating if the user's phone number is verified */
  phone_number_verified: boolean
  /** The user's address */
  address: string
  /** Custom fields */
  custom_data: object
  /** The linked identities of the user */
  identities: object
  /** The linked SSO identities of the user */
  sso_identities: object[]
  /** The organization IDs the user belongs to */
  organizations: string[]
  /** The organization data the user belongs to */
  organization_data: object[]
  /** The organization roles the user belongs to with the format of organization_id:/role_name */
  organization_roles: string[]
  /** The user's custom attributes */
  [claim: string]: unknown
}

/**
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/logto
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Logto from "@auth/core/providers/logto"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Logto({
 *       clientId: LOGTO_ID,
 *       clientSecret: LOGTO_SECRET,
 *       issuer: LOGTO_ISSUER
 *     }),
 *   ],
 * })
 * ```
 *
 *
 * ### Resources
 *
 * - [Logto Auth.js quickstart](https://docs.logto.io/quick-starts/next-auth)
 * - [Integrate Logto in your application](https://docs.logto.io/integrate-logto/integrate-logto-into-your-application)
 *
 * ### Notes
 *
 * The Logto provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/logto.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::info
 * By default, Auth.js assumes that the Logto provider is based on the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) spec
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
export default function Logto(
  options: OIDCUserConfig<LogtoProfile>
): OIDCConfig<LogtoProfile> {
  return {
    id: "logto",
    name: "Logto",
    type: "oidc",
    authorization: {
      params: {
        scope: "offline_access openid email profile",
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.username,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
