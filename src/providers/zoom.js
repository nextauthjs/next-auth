export default function Zoom(options) {
  return {
    id: "zoom",
    name: "Zoom",
    type: "oauth",
    authorization: "https://zoom.us/oauth/authorize",
    accessTokenUrl: "https://zoom.us/oauth/token",
    profileUrl: "https://api.zoom.us/v2/users/me",
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: null,
      }
    },
    ...options,
  }
}
