export default function Box(options) {
  return {
    id: "box",
    name: "Box",
    type: "oauth",
    authorization: "https://account.box.com/api/oauth2/authorize",
    accessTokenUrl: "https://api.box.com/oauth2/token",
    profileUrl: "https://api.box.com/2.0/users/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.login,
        image: profile.avatar_url,
      }
    },
    ...options,
  }
}
