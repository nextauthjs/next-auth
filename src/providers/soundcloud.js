export default function SoundCloud(options) {
  return {
    id: "soundcloud",
    name: "SoundCloud",
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://api.soundcloud.com/oauth2/token",
    authorizationUrl: "https://api.soundcloud.com/connect?response_type=code",
    profileUrl: "https://api.soundcloud.com/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.full_name,
        username: profile.username,
        image: profile.avatar_url,
      }
    },
    ...options,
  }
}
