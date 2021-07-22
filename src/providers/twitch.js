export default function Twitch(options) {
  return {
    id: "twitch",
    name: "Twitch",
    type: "oauth",
    authorization:
      "https://id.twitch.tv/oauth2/authorize?scope=user:read:email",
    token: "https://id.twitch.tv/oauth2/token",
    profileUrl: "https://api.twitch.tv/helix/users",
    profile(profile) {
      const data = profile.data[0]
      return {
        id: data.id,
        name: data.display_name,
        email: data.email,
        image: data.profile_image_url,
      }
    },
    ...options,
  }
}
