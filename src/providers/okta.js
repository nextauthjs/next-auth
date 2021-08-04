export default function Okta(options) {
  return {
    id: "okta",
    name: "Okta",
    type: "oauth",
    authorization: `${options.issuer}v1/authorize?scope=openid+profile+email`,
    token: `${options.issuer}v1/token`,
    userinfo: `${options.issuer}v1/userinfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    options,
  }
}
