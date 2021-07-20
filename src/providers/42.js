export default function FortyTwo(options) {
  return {
    id: "42-school",
    name: "42 School",
    type: "oauth",
    authorization: "https://api.intra.42.fr/oauth/authorize",
    accessTokenUrl: "https://api.intra.42.fr/oauth/token",
    profileUrl: "https://api.intra.42.fr/v2/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.usual_full_name,
        email: profile.email,
        image: profile.image_url,
      }
    },
    ...options,
  }
}
