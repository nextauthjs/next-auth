export default function Medium(options) {
  return {
    id: "medium",
    name: "Medium",
    type: "oauth",
    version: "2.0",
    scope: "basicProfile",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://api.medium.com/v1/tokens",
    authorizationUrl: "https://medium.com/m/oauth/authorize?response_type=code",
    profileUrl: "https://api.medium.com/v1/me",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: null,
        image: profile.data.imageUrl,
      }
    },
    ...options,
  }
}
