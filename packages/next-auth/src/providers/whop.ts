import type { OAuthConfig, OAuthUserConfig } from "."

/** @see https://dev.whop.com/reference/retrieve_users_profile */
export interface WhopProfile extends Record<string, any> {
  id: string
  username: string
  email: string
  profile_pic_url: string
  social_accounts: WhopSocialAccount[]
  roles: string
}

export interface WhopSocialAccount extends Record<string, any> {
  service: string
  username: string
  id: string
}

export default function Whop<P extends WhopProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "whop",
    name: "Whop",
    type: "oauth",
    authorization: {
      url: "https://whop.com/oauth",
      params: {
        scope: "openid",
      },
    },
    token: "https://data.whop.com/api/v3/oauth/token",
    userinfo: "https://api.whop.com/api/v2/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.profile_pic_url,
      }
    },
    style: {
      logo: "https://whop.com/v2/whop-logo-circle.png",
      logoDark: "https://whop.com/v2/whop-logo-circle.png",
      bg: "#fff",
      text: "#FF6243",
      bgDark: "#FF6243",
      textDark: "#fff",
    },
    options,
  }
}
