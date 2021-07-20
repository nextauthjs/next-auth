export default function WorkOS(options) {
  const { domain = "api.workos.com" } = options

  return {
    id: "workos",
    name: "WorkOS",
    type: "oauth",
    authorization: `https://${domain}/sso/authorize`,
    accessTokenUrl: `https://${domain}/sso/token`,
    profileUrl: `https://${domain}/sso/profile`,
    profile: (profile) => {
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
