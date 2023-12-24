/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Atlassian</b> integration.
 * </span>
 * <a href="https://www.atlassian.com/" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/atlassian.svg" width="24" style={{ marginTop: "-3px"}} />
 * </a>
 * </div>
 *
 * @module providers/atlassian
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** The returned user profile from Atlassian when using the profile callback. */
export interface AtlassianProfile extends Record<string, any> {
  /**
   * The user's atlassian account ID
   */
  account_id: string
  /**
   * The user name
   */
  name: string
  /**
   * The user's email
   */
  email: string
  /**
   * The user's profile picture
   */
  picture: string
}

/**
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/atlassian
 * ```
 *
 * #### Configuration
 *
 * Import the provider and configure it in your **Auth.js** initialization file:
 *
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import AtlassianProvider from "next-auth/providers/atlassian"
 *
 * export default NextAuth({
 *   providers: [
 *     AtlassianProvider({
 *       clientId: process.env.ATLASSIAN_ID,
 *       clientSecret: process.env.ATLASSIAN_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Atlassian docs](https://developer.atlassian.com/server/jira/platform/oauth/)
 *
 * ### Notes
 *
 * The Atlassian provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/atlassian.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Atlassian<P extends AtlassianProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "atlassian",
    name: "Atlassian",
    type: "oauth",
    authorization: {
      url: "https://auth.atlassian.com/authorize",
      params: {
        audience: "api.atlassian.com",
        prompt: "consent",
      },
    },
    token: "https://auth.atlassian.com/oauth/token",
    userinfo: "https://api.atlassian.com/me",
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    style: { logo: "/atlassian.svg", bg: "#fff", text: "#0052cc" },
    options,
  }
}
