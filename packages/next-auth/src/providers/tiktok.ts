import { TokenSet } from "src"
import type { OAuthConfig, OAuthUserConfig } from "."

/** @see https://developers.tiktok.com/doc/tiktok-api-v2-get-user-info/ */
export interface TiktokProfile extends Record<string, any> {
  data?: Data
  error?: Error
}

export interface Data {
  user?: User
}

export interface User {
  display_name?: string
  following_count?: number
  is_verified?: boolean
  open_id?: string
  union_id?: string
  video_count?: number
  avatar_url?: string
  bio_description?: string
  follower_count?: number
  likes_count?: number
  profile_deep_link?: string
  username?: string
}

export interface Error {
  code?: string
  message?: string
  log_id?: string
}

export default function Tiktok<P extends TiktokProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    authorization: {
      url: "https://www.tiktok.com/v2/auth/authorize",
      params: {
        client_key: options.clientId,
        scope: "user.info.profile",
        response_type: "code",
      },
    },
    token: {
      async request({ checks, client, params, provider }) {
        const res = await fetch(`https://open.tiktokapis.com/v2/oauth/token/`, {
          method: "POST",
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_key: provider.clientId!,
            client_secret: provider.clientSecret!,
            code: params.code!,
            grant_type: "authorization_code",
            redirect_uri: provider.callbackUrl!,
          }),
        }).then((res) => res.json())

        const tokens: TokenSet = {
          access_token: res.access_token,
          expires_at: res.expires_in,
          refresh_token: res.refresh_token,
          scope: res.scope,
          id_token: res.open_id,
          token_type: res.token_type,
          session_state: res.open_id,
        }
        return {
          tokens,
        }
      },
    },
    userinfo: {
      url: "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,username",
      async request({ client, provider, tokens }) {
        const res: any = await client.userinfo(tokens.access_token!)
        return res.data.user
      },
    },
    profile(profile) {
      return {
        id: profile.open_id,
        name: profile.display_name,
        image: profile.avatar_url,
        email: profile.email || null,
      }
    },
    style: {
      logo: "/tiktok.svg",
      logoDark: "/tiktok-dark.svg",
      bg: "#fff",
      bgDark: "#000",
      text: "#000",
      textDark: "#fff",
    },
    options,
  }
}
