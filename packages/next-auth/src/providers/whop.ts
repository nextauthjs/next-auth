import { OAuthUserConfig, OAuthConfig } from "./oauth"

export interface WhopProfile extends Record<string, any> {
  id: string
  name: string
  email: string
  image: string
  social_accounts: WhopSocialAccount[]
}

export interface WhopSocialAccount extends Record<string, string> {
  service: string
  username: string
  id: string
}

export function Whop<P extends WhopProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "whop",
    name: "Whop",
    type: "oauth",
    authorization: "https://whop.com/oauth",
    token: "https://data.whop.com/api/v3/oauth/token",
    userinfo: "https://data.whop.com/api/v2/me",
    allowDangerousEmailAccountLinking: true,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.profile_pic_url,
      }
    },
    style: {
      logo: "https://whop.com/logo.svg",
      logoDark: "https://whop.com/logo.svg",
      bg: "#fff",
      text: "#FF6243",
      bgDark: "#FF6243",
      textDark: "#fff",
    },
    options,
  }
}
