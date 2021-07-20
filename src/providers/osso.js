export default function Osso(options) {
  return {
    id: "osso",
    name: "Osso",
    type: "oauth",
    authorization: `https://${options.domain}/oauth/authorize`,
    accessTokenUrl: `https://${options.domain}/oauth/token`,
    profileUrl: `https://${options.domain}/oauth/me`,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    ...options,
  }
}
