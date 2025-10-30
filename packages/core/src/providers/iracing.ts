/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Discord</b> integration.</span>
 * <a href="https://iracing.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/iracing.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/iracing
 */

import type { OAuthUserConfig, OAuthConfig } from "./index.js"

export interface IRacingProfile {
  iracing_name: string
  iracing_cust_id: number
}

/**
 * Add iRacing login to you page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/iracing
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import iRacing from "@auth/core/providers/iracing"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     iRacing({
 *       clientId: IRACING_CLIENT_ID,
 *       clientSecret: IRACING_CLIENT_SECRET
 *     })
 *   ]
 * })
 * ```
 *
 * ### Resources
 *
 * - [iRacing OAuth documentation](https://oauth.iracing.com/oauth2/book/introduction.html)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the iRacing provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * You need to configure a client with iRacing as described at https://oauth.iracing.com/oauth2/book/client_registration.html
 *
 * :::tip
 *
 * The HubSpot provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/hubspot.ts).
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
export default function IRacing<P extends IRacingProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "iracing",
    name: "iRacing",
    type: "oauth",
    issuer: "https://oauth.iracing.com/oauth2",
    authorization: {
      url: "https://oauth.iracing.com/oauth2/authorize",
      params: {
        scope: "iracing.profile iracing.auth",
      },
    },
    token: {
      url: "https://oauth.iracing.com/oauth2/token",
      conform: async (response) => {
        const data = await response.clone().json()
        if (data?.refresh_token === null) {
          delete data.refresh_token
        }

        if (data?.refresh_token_expires_in === null) {
          delete data.refresh_token_expires_in
        }

        if (data?.scope === null) {
          delete data.scope
        }

        return new Response(JSON.stringify(data), {
          status: response.status,
          headers: response.headers,
        })
      },
    },
    userinfo: "https://oauth.iracing.com/oauth2/iracing/profile",
    profile(profile) {
      return {
        id: profile.iracing_cust_id.toString(),
        name: profile.iracing_name,
      }
    },
    style: { brandColor: "#0F1F43", text: "#fff" },
    options,
  }
}
