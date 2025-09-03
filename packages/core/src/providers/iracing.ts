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
 * ### Notes
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
        scope: "iracing.profile",
      },
    },
    token: {
      url: "https://oauth.iracing.com/oauth2/token",
      conform: async (response) => {
        const data = await response.clone().json()
        if (data?.refresh_token === null) {
          delete data.refresh_token
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
    options,
  }
}
