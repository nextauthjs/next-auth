/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Slack</b> integration.</span>
 * <a href="https://www.slack.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/slack.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/slack
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface SlackProfile extends Record<string, any> {
  ok: boolean
  sub: string
  "https://slack.com/user_id": string
  "https://slack.com/team_id": string
  email: string
  email_verified: boolean
  date_email_verified: number
  name: string
  picture: string
  given_name: string
  family_name: string
  locale: string
  "https://slack.com/team_name": string
  "https://slack.com/team_domain": string
  "https://slack.com/user_image_24": string
  "https://slack.com/user_image_32": string
  "https://slack.com/user_image_48": string
  "https://slack.com/user_image_72": string
  "https://slack.com/user_image_192": string
  "https://slack.com/user_image_512": string
  "https://slack.com/user_image_1024": string
  "https://slack.com/team_image_34": string
  "https://slack.com/team_image_44": string
  "https://slack.com/team_image_68": string
  "https://slack.com/team_image_88": string
  "https://slack.com/team_image_102": string
  "https://slack.com/team_image_132": string
  "https://slack.com/team_image_230": string
  "https://slack.com/team_image_default": boolean
}

/**
 * Add Slack login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/slack
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Slack from "@auth/core/providers/slack"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Slack({ clientId: SLACK_CLIENT_ID, clientSecret: SLACK_CLIENT_SECRET }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Slack Authentication documentation](https://api.slack.com/authentication)
 * - [Sign-in with Slack](https://api.slack.com/docs/sign-in-with-slack)
 * - [Slack app console](https://api.slack.com/apps)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Slack provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::danger
 *
 * Slack requires that the redirect URL of your app uses https, even for local development.
 * An easy workaround for this is using a service like [ngrok](https://ngrok.com/) that creates a secure tunnel to your app, using https. Remember to set the url as `NEXTAUTH_URL` as well.
 *
 * :::
 *
 * :::tip
 *
 * The Slack provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/slack.ts).
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
export default function Slack<P extends SlackProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "slack",
    name: "Slack",
    type: "oidc",
    issuer: "https://slack.com",
    checks: ["nonce"],
    style: { brandColor: "#611f69" },
    options,
  }
}
