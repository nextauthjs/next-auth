/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Figma</b> integration.</span>
 * <a href="https://figma.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/figma.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/discord
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
 *       clientId: process.env.BITBUCKET_CLIENT_ID,
 *       clientSecret: process.env.BITBUCKET_CLIENT_SECRET
 *     })
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Using OAuth 2 on Figma](https://www.figma.com/developers/api#oauth2)
 * - [User Type](https://www.figma.com/developers/api#users-types)
 * - [Scopes](https://www.figma.com/developers/api#authentication-scopes)
 * - [Migrate](https://www.figma.com/developers/api#oauth_migration_guide)
 *
 * #### Notes
 *
 * By default, Auth.js assumes that the Figma provider is based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Bitbucket provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/bitbucket.ts).
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
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  const state = Buffer.from(bytes).toString("base64")
  return {
    id: "figma",
    name: "Figma",
    type: "oauth",
    authorization: {
      url: "https://www.figma.com/oauth",
      params: {
        scope: "files:read",
        state,
      },
    },
    token: {
      url: "https://api.figma.com/v1/oauth/token",
      async request({ params, provider }: any) {
        return await fetch(provider.token.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
              `${options.clientId}:${options.clientSecret}`
            ).toString("base64")}`,
          },
          body: new URLSearchParams({
            code: params.code,
            grant_type: "authorization_code",
            redirect_uri: options.redirectProxyUrl!,
          }).toString(),
        }).then((response) => response.json())
      },
    },
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
