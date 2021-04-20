export default function LINE(options) {
  return {
    id: "line",
    name: "LINE",
    type: "oauth",
    version: "2.0",
    scope: "profile openid",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://api.line.me/oauth2/v2.1/token",
    authorizationUrl:
      "https://access.line.me/oauth2/v2.1/authorize?response_type=code",
    profileUrl: "https://api.line.me/v2/profile",
    profile(profile) {
      return {
        id: profile.userId,
        name: profile.displayName,
        email: null,
        image: profile.pictureUrl,
      }
    },
    ...options,
  }
}
