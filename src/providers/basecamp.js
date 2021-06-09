export default function Basecamp(options) {
  return {
    id: "basecamp",
    name: "Basecamp",
    type: "oauth",
    version: "2.0",
    accessTokenUrl:
      "https://launchpad.37signals.com/authorization/token?type=web_server",
    authorizationUrl:
      "https://launchpad.37signals.com/authorization/new?type=web_server",
    profileUrl: "https://launchpad.37signals.com/authorization.json",
    profile(profile) {
      return {
        id: profile.identity.id,
        name: `${profile.identity.first_name} ${profile.identity.last_name}`,
        email: profile.identity.email_address,
        image: null,
      }
    },
    ...options,
  }
}
