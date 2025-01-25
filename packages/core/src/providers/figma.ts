/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Figma</b> integration.</span>
 * <a href="https://figma.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/figma.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/figma
 */
import { OAuth2Config, OAuthUserConfig } from "./index.js"

/**
 * @see https://www.figma.com/developers/api#users-types
 */
interface FigmaProfile {
  id: string
  email: string
  handle: string
  img_url: string
}

/**
 * ### Setup
 *
 * #### Callback URL
 *
 * ```ts
 * https://example.com/api/auth/callback/figma
 * ```
 *
 * #### Configuration
 *
 * ```ts
 * import { Auth } from "@auth/core"
 * import Figma from "@auth/core/providers/figma"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Figma({
 *       clientId: process.env.AUTH_FIGMA_ID,
 *       clientSecret: process.env.AUTH_FIGMA_SECRET
 *     })
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Using OAuth 2 on Figma](https://www.figma.com/developers/api#oauth2)
 * - [Scopes](https://www.figma.com/developers/api#authentication-scopes)
 *
 * #### Notes
 *
 * By default, Auth.js assumes that the Figma provider is based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Figma provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/figma.ts).
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
export default function Figma(
  options: OAuthUserConfig<FigmaProfile>
): OAuth2Config<FigmaProfile> {
  return {
    id: "figma",
    name: "Figma",
    type: "oauth",
    authorization: {
      url: "https://www.figma.com/oauth",
      params: {
        scope: "files:read",
      },
    },
    checks: ["state"],
    token: "https://api.figma.com/v1/oauth/token",
    userinfo: "https://api.figma.com/v1/me",
    profile(profile) {
      return {
        name: profile.handle,
        email: profile.email,
        id: profile.id,
        image: profile.img_url,
      }
    },
    style: {
      text: "#fff",
      bg: "#ff7237",
    },
    options,
  }
}
