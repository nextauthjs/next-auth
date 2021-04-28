export default function IdentityServer4(options) {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oauth",
    version: "2.0",
    scope: "openid profile email",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: `https://${options.domain}/connect/token`,
    authorizationUrl: `https://${options.domain}/connect/authorize?response_type=code`,
    profileUrl: `https://${options.domain}/connect/userinfo`,
    profile(profile) {
      return { ...profile, id: profile.sub }
    },
    ...options,
  }
}
