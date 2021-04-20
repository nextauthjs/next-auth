export default function FusionAuth(options) {
  let authorizationUrl = `https://${options.domain}/oauth2/authorize?response_type=code`
  if (options.tenantId) {
    authorizationUrl += `&tenantId=${options.tenantId}`
  }

  return {
    id: "fusionauth",
    name: "FusionAuth",
    type: "oauth",
    version: "2.0",
    scope: "openid",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: `https://${options.domain}/oauth2/token`,
    authorizationUrl,
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
