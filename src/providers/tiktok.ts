import { custom, TokenSet, TokenSetParameters } from "openid-client"
import { OAuthConfig, OAuthUserConfig } from "."

export interface TikTokProfile {
  avatar_large_url: string
  avatar_url_100: string
  avatar_url_200: string
  avatar_url: string
  display_name: string
  open_id: string
  union_id: string
}

export default function TikTok<P extends Record<string, any> = TikTokProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    version: "2.0",
    authorization: {
      params: {
        client_key: options.clientId,
        scope: "user.info.basic",
        response_type: "code",
      },
      url: "https://open-api.tiktok.com/platform/oauth/connect",
    },
    httpOptions: {
      timeout: 6000,
    },
    token: {
      url: "https://open-api.tiktok.com/oauth/access_token",
      request: async ({ checks, client, params, provider }) => {
        const data = await client.grant({
          code: params.code,
          redirect_uri: provider.callbackUrl,
          params,
          grant_type: "authorization_code",
          client_key: options.clientId,
          client_secret: options.clientSecret,
          code_verifier: checks.code_verifier,
        })
        const tokens = data.data as TokenSetParameters

        return { tokens }
      },
    },
    // @ts-expect-error TikTokProfile isn't recognized as a valid Profile object
    userinfo: {
      url: "https://open-api.tiktok.com/oauth/userinfo",
      request: async ({ client, tokens }) => {
        client[custom.http_options] = (_url, options) => {
          return { ...options, followRedirect: true }
        }

        const tokenSet = tokens as TokenSet
        const data = await client.userinfo<{ data: TikTokProfile }>(tokenSet, {
          method: "GET",
          params: {
            access_token: tokens.access_token,
            open_id: tokens.open_id,
          },
        })

        return data.data
      },
    },
    profile(tikTokData) {
      return {
        email: null,
        image: tikTokData.avatar_url,
        id: tikTokData.open_id,
        name: tikTokData.display_name,
      }
    },
    ...options,
  }
}
