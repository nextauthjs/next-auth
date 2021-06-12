export default function WorkOS(options) {
  const domain = options.domain || "api.workos.com"

  return {
    id: "workos",
    name: "WorkOS",
    type: "oauth",
    version: "2.0",
    scope: "",
    params: {
      grant_type: "authorization_code",
      client_id: options.clientId,
      client_secret: options.clientSecret,
    },
    accessTokenUrl: `https://${domain}/sso/token`,
    authorizationUrl: `https://${domain}/sso/authorize?response_type=code`,
    profileUrl: `https://${domain}/sso/profile`,
    profile: (profile) => {
      return {
        ...profile,
        name: `${profile.first_name} ${profile.last_name}`,
      }
    },
    ...options,
  }
}
