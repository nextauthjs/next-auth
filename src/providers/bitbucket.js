export default function Bitbucket(options) {
  return {
    id: "bitbucket",
    name: "Bitbucket",
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    accessToken: "https://bitbucket.org/site/oauth2/access_token",
    authorizationUrl:
      "https://bitbucket.org/site/oauth2/authorize?response_type=code",
    profileUrl: "https://api.bitbucket.org/2.0/user",
    profile(profile) {
      return {
        id: profile.account_id,
        name: profile.display_name,
        image: profile.links.avatar.href,
      }
    },
    ...options,
  }
}
