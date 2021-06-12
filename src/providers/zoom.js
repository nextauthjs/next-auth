export default function Zoom(options) {
  return {
    id: "zoom",
    name: "Zoom",
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://zoom.us/oauth/token",
    authorizationUrl: "https://zoom.us/oauth/authorize?response_type=code",
    profileUrl: "https://api.zoom.us/v2/users/me",
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
      }
    },
    ...options,
  }
}
