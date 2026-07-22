/**
 * <div class="provider" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>ThunderID</b> integration.
 * </span>
 * <a href="https://thunderid.dev/" style={{backgroundColor: "#ECEFF1", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/thunderid.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/thunderid
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

/** The returned user profile from ThunderID when using the profile callback. */
export interface ThunderIDProfile extends Record<string, any> {
  /** The user ThunderID account ID (subject identifier) */
  sub: string

  // Standard OIDC `profile` scope claims
  /** The user's full name */
  name?: string
  /** The user's given (first) name */
  given_name?: string
  /** The user's family (last) name */
  family_name?: string
  /** The user's middle name */
  middle_name?: string
  /** The user's nickname */
  nickname?: string
  /** The user's preferred username */
  preferred_username?: string
  /** URL of the user's profile page */
  profile?: string
  /** URL of the user's profile picture */
  picture?: string
  /** URL of the user's website */
  website?: string
  /** The user's gender */
  gender?: string
  /** The user's birthdate (YYYY-MM-DD) */
  birthdate?: string
  /** The user's time zone (IANA timezone string) */
  zoneinfo?: string
  /** The user's locale (BCP 47 language tag) */
  locale?: string
  /** Unix timestamp of the last profile update */
  updated_at?: number

  // Standard OIDC `email` scope claims
  /** The user's email address */
  email?: string
  /** Whether the email address has been verified */
  email_verified?: boolean

  // Standard OIDC `phone` scope claims
  /** The user's phone number */
  phone_number?: string
  /** Whether the phone number has been verified */
  phone_number_verified?: boolean

  // Standard OIDC `address` scope claims
  /** The user's postal address */
  address?: string | Record<string, string>

  // ThunderID custom claims
  /** The user type as configured in the ThunderID system */
  userType?: string
  /** Organization unit ID the user belongs to */
  ouId?: string
  /** Organization unit name */
  ouName?: string
  /** Organization unit handle */
  ouHandle?: string
  /** Roles assigned to the user (returned with the `roles` scope) */
  roles?: string[]
  /** Groups the user belongs to (requires explicit configuration) */
  groups?: string[]
}

/**
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/thunderid
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import ThunderID from "@auth/core/providers/thunderid"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     ThunderID({
 *       clientId: AUTH_THUNDERID_ID,
 *       clientSecret: AUTH_THUNDERID_SECRET,
 *       issuer: AUTH_THUNDERID_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Configuring ThunderID
 *
 * 1. Get ThunderID installed on your environment (via `npx thunderid` or any [other option](https://thunderid.dev/docs/next/guides/getting-started/get-thunderid/))
 * 2. Go to the **ThunderID Console** at `https://{THUNDERID_HOST}:{THUNDERID_PORT}/console`
 * 3. Create an application with the **Next.js** template
 *    > **Important:** Copy the **Client Secret** at the end of the wizard — it will not be shown again
 * 4. In the **General** tab, **Access** section → **Authorized redirect URIs**, add:
 *    - Development: `http://localhost:3000/api/auth/callback/thunderid`
 *    - Production: `https://{YOUR_DOMAIN}/api/auth/callback/thunderid`
 *
 * Then, create a `.env.local` file in the project root and add the following entries:
 *
 * ```
 * AUTH_THUNDERID_ID="Your Client ID here"
 * AUTH_THUNDERID_SECRET="Your Client Secret here"
 * AUTH_THUNDERID_ISSUER="Your ThunderID issuer URL here"
 * ```
 *
 * ### Resources
 *
 * - [ThunderID Documentation](https://thunderid.dev/docs/next/)
 * - [OAuth 2.0 / OpenID Connect Documentation](https://tools.ietf.org/html/rfc6749)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 *
 * ### Notes
 *
 * The ThunderID provider comes with a [default configuration](#configuration). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::info
 * By default, Auth.js assumes that the ThunderID provider is based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) and [OpenID Connect](https://openid.net/connect/) specs
 * :::
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://github.com/nextauthjs/next-auth/issues/new?title=ThunderID%20Provider).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [GitHub Discussions](https://github.com/nextauthjs/next-auth/discussions).
 */
export default function ThunderID(
  config: OIDCUserConfig<ThunderIDProfile>
): OIDCConfig<ThunderIDProfile> {
  const issuer = config?.issuer?.replace(/\/$/, "")

  return {
    id: "thunderid",
    name: "ThunderID",
    type: "oidc",
    wellKnown: `${issuer}/.well-known/openid-configuration`,
    style: {
      bg: "#3688FF",
      text: "#ffffff",
    },
    options: config,
    client: { token_endpoint_auth_method: "client_secret_basic" },
    profile(profile) {
      return {
        id: profile.sub,
        name:
          profile.name ??
          ([profile.given_name, profile.family_name]
            .filter(Boolean)
            .join(" ") ||
            null),
        email: profile.email ?? null,
        image: profile.picture ?? null,
      }
    },
  }
}
