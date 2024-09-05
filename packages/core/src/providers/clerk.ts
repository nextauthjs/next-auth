/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Clerk</b> integration.
 * </span>
 * <a href="https://clerk.com" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/clerk.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/clerk
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** @see [Get the authenticated user](https://clerk.com/docs/reference/frontend-api/tag/OAuth2-Identify-Provider#operation/getOAuthUserInfo). */
export interface ClerkProfile {
  object: "string"
  instance_id: "string"
  email: "string"
  email_verified: boolean
  family_name: "string"
  given_name: "string"
  name: "string"
  username: "string"
  picture: "string"
  user_id: "string"
  public_metadata?: any
  private_metadata?: any
  unsafe_metadata?: any
}

/**
 * Add Clerk login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/clerk
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Clerk from "@auth/core/providers/clerk"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Clerk({
 *       clientId: CLERK_CLIENT_ID,
 *       clientSecret: CLERK_CLIENT_SECRET,
 *       baseUrl: CLERK_BASE_URL
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Clerk - Use Clerk as an OAuth 2 Provider](https://clerk.com/docs/advanced-usage/clerk-idp)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Clerk provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Clerk provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/clerk.ts).
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
export default function Clerk(
  config: OAuthUserConfig<ClerkProfile> & {
    baseUrl: string
  }
): OAuthConfig<ClerkProfile> {
  const baseUrl = config.baseUrl

  return {
    id: "clerk",
    name: "Clerk",
    type: "oauth",
    wellKnown: `${baseUrl}/.well-known/openid-configuration`,
    authorization: {
      url: `${baseUrl}/oauth/authorize`,
      params: { scope: "email profile" },
    },
    token: `${baseUrl}/oauth/token`,
    userinfo: {
      url: `${baseUrl}/oauth/userinfo`,
      async request({ tokens, provider }) {
        const profile = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        }).then(async (res) => await res.json())

        return profile
      },
    },
    profile(profile) {
      return profile
    },
    style: { bg: "#6C47FF", text: "#fff" },
    options: config,
  }
}
