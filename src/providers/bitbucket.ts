import { OAuthConfig, OAuthUserConfig } from "./oauth"

interface Resource {
  href: string
  name: string
}

interface BitbucketProfile {
  username: string
  account_id: string
  display_name: string
  nickname: string
  created_on: string
  is_staff: boolean
  location: string
  account_status: string
  type: string
  uuid: string
  has_2fa_enabled: boolean | null
  links: {
    self: Resource
    html: Resource
    avatar: Resource
    followers: Resource
    following: Resource
    repositories: Resource
  }
}

export default function Bitbucket<P extends Record<string, any> = BitbucketProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "bitbucket",
    name: "Bitbucket",
    type: "oauth",
    authorization: {
      url: "https://bitbucket.org/site/oauth2/authorize",
      params: {
        scope: "",
      },
    },
    token: "https://bitbucket.org/site/oauth2/access_token",
    userinfo: "https://api.bitbucket.org/2.0/user",
    profile(profile) {
      return {
        id: profile.account_id,
        email: null,
        image: profile.links.avatar.href,
        name: profile.display_name,
      }
    },
    options,
  }
}
