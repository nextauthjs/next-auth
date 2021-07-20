export default function Okta(options) {
  return {
    id: "okta",
    name: "Okta",
    type: "oauth",
    authorization: `https://${options.domain}/v1/authorize?scope=openid+profile+email`,
    accessTokenUrl: `https://${options.domain}/v1/token`,
    profileUrl: `https://${options.domain}/v1/userinfo/`,
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
