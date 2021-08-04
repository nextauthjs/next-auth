export default function LINE(options) {
  return {
    id: "line",
    name: "LINE",
    type: "oauth",
    authorization:
      "https://access.line.me/oauth2/v2.1/authorize?scope=openid+profile",
    token: "https://api.line.me/oauth2/v2.1/token",
    userinfo: "https://api.line.me/v2/profile",
    profile(profile) {
      return {
        id: profile.userId,
        name: profile.displayName,
        email: null,
        image: profile.pictureUrl,
      }
    },
    options,
  }
}
