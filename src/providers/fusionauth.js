export default function FusionAuth(options) {
  return {
    id: "fusionauth",
    name: "FusionAuth",
    type: "oauth",
    authorization: `https://${options.domain}/oauth2/authorize`,
    accessTokenUrl: `https://${options.domain}/oauth2/token`,
    profileUrl: `https://${options.domain}/oauth2/userinfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    ...options,
  }
}
