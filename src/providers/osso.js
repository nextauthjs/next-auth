export default function Osso(options) {
  return {
    id: "osso",
    name: "Osso",
    type: "oauth",
    authorization: `${options.issuer}oauth/authorize`,
    token: `${options.issuer}oauth/token`,
    userinfo: `${options.issuer}oauth/me`,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    options,
  }
}
