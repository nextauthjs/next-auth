import type { OAuthConfig, OAuthUserConfig } from './index.js'

/** https://dev.wealthbox.com/ */
export interface WealthboxProfile {
  id: string
  name: string
  email: string
  first_name: string
  last_name: string
  plan: string
  created_at?: Date
  updated_at?: Date
  current_user?: {
    id: number
    name: string
    email: string
    account: number
  }
  accounts?: Array<{ id: number; name: string; created_at: Date }>
  users?: Array<{ id: number; email: string; name: string; account: number }>
}

interface TokenResponse {
    access_token: string
    created_at: number
    expires_in: number
    refresh_token: string
    scope: string
  }
interface AdditionalConfig {
  redirectUri: string
}

/**
 * Add Wealthbox login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/wealthbox
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Wealthbox from "@auth/core/providers/wealthbox"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Wealthbox({
 *       clientId: WEALTHBOX_CLIENT_ID,
 *       clientSecret: WEALTHBOX_CLIENT_SECRET,
 *       redirectUri: WEALTHBOX_REDIRECT_URI
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Wealthbox App documentation](https://dev.wealthbox.com/)
 * ```
 */

export default function WealthboxProvider<P extends WealthboxProfile>(
  config: OAuthUserConfig<P> & AdditionalConfig
): OAuthConfig<P> {
  return {
    id: 'wealthbox',
    name: 'Wealthbox',
    type: 'oauth',
    authorization: {
      url: 'https://app.crmworkspace.com/oauth/authorize',
      params: {
        scope: 'login data',
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri
      }
    },
    token: {
      url: 'https://app.crmworkspace.com/oauth/token',
      async request(context) {
        const response = await fetch(
          'https://app.crmworkspace.com/oauth/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
              client_id: context.provider.clientId as string,
              client_secret: context.provider.clientSecret as string,
              code: context.params.code ?? '',
              grant_type: 'authorization_code',
              redirect_uri: config.redirectUri
            })
          }
        )

        const data: TokenResponse = await response.json()

        const { expires_in, ...rest } = data

        //bind expires_in to expires_at
        return {
          tokens: {
            ...rest,
            expires_at: Date.now() + expires_in * 1000
          }
        }
      }
    },
    userinfo: {
      url: 'https://api.crmworkspace.com/v1/me',
      async request(context) {
        const response = await fetch('https://api.crmworkspace.com/v1/me', {
          headers: {
            Authorization: `Bearer ${context.tokens.access_token}`
          }
        })

        const user = await response.json()

        return user
      }
    },
    async profile(profile) {
      return {
        ...profile
      }
    },
    options: config
  }
}
