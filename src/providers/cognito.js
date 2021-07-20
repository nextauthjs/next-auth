export default function Cognito(options) {
  const { domain } = options
  return {
    id: "cognito",
    name: "Cognito",
    type: "oauth",
    authorization: `https://${domain}/oauth2/authorize?scope=openid+profile+email`,
    accessTokenUrl: `https://${domain}/oauth2/token`,
    profileUrl: `https://${domain}/oauth2/userInfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.username,
        email: profile.email,
        image: null,
      }
    },
    ...options,
  }
}
