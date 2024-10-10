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
 * ```ts
 * import Atlassian from "@auth/core/providers/atlassian"
 * ...
 * providers: [
 *  Atlassian({
 *    clientId: env.AUTH_ATLASSIAN_ID,
 *    clientSecret: env.AUTH_ATLASSIAN_SECRET,
 *  }),
 * ]
 * ...
 * ```
 *
 * ### Configuring Atlassian
 *
 * Follow these steps:
 *
 * 1. From any page on [developer.atlassian.com](https://developer.atlassian.com), select your profile icon in the top-right corner, and from the dropdown, select **Developer console**.
 * 2. Select your app from the list (or create one if you don't already have one)
 * 3. Select **Authorization** in the left menu
 * 4. Next to OAuth 2.0 (3LO), select **Configure** (or **Add** for newly created app)
 * 5. Enter the **Callback URL**: `https://{YOUR_DOMAIN}/api/auth/callback/atlassian`
 * 6. Click Save changes
 * 7. Select **Settings** in the left menu
 * 8. Access and copy your app's **Client ID** and **Secret**
 *
 * Then, create a `.env` file in the project root add the following entries:
 *
 * ```
 * AUTH_ATLASSIAN_ID=<Client ID copied in step 8>
 * AUTH_ATLASSIAN_SECRET=<Secret copied in step 8>
 * ```
 *
 * ### Resources
 *
 * - [Atlassian docs](https://developer.atlassian.com/cloud/jira/software/oauth-2-3lo-apps/)
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
export default function Atlassian(
  options: OAuthUserConfig<AtlassianProfile>
): OAuthConfig<AtlassianProfile> {
  return {
    id: "atlassian",
    name: "Atlassian",
    type: "oauth",
    authorization: {
      url: "https://auth.atlassian.com/authorize",
      params: { audience: "api.atlassian.com", scope: "read:me" },
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
    checks: ["state"],
    style: { bg: "#fff", text: "#0052cc" },
    options,
  }
}
