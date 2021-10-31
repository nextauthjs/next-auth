import { OAuthConfig, OAuthUserConfig } from "./oauth"

interface BitbucketProfile {
  username: string
  account_id: string
  display_name: string
  links: {
    avatar: {
      href: string
    }
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
        scope: ""
      }
    },
    token: "https://bitbucket.org/site/oauth2/access_token",
    userinfo: "https://api.bitbucket.org/2.0/user",
    profile(profile) {
      return {
        id: profile.account_id,
        email: null,
        image: profile.links.avatar.href,
        name: profile.display_name
      }
    },
    checks: ["none"],
    options,
  }
}
