export default function IdentityServer4(options) {
  return {
    id: "identity-server4",
    name: "IdentityServer4",
    type: "oauth",
    authorization: `https://${options.domain}/connect/authorize?scope=openid+profile+email`,
    accessTokenUrl: `https://${options.domain}/connect/token`,
    profileUrl: `https://${options.domain}/connect/userinfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    ...options,
  }
}
