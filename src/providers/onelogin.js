export default function OneLogin(options) {
  return {
    id: "onelogin",
    name: "OneLogin",
    type: "oauth",
    version: "2.0",
    scope: "openid profile name email",
    params: { grant_type: "authorization_code" },
    // These will be different depending on the Org.
    accessTokenUrl: `https://${options.domain}/oidc/2/token`,
    requestTokenUrl: `https://${options.domain}/oidc/2/auth`,
    authorizationUrl: `https://${options.domain}/oidc/2/auth?response_type=code`,
    profileUrl: `https://${options.domain}/oidc/2/me`,
    profile(profile) {
      return { ...profile, id: profile.sub }
    },
    ...options,
  }
}
