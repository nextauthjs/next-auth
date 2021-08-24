/** @type {import(".").OAuthProvider} */
export default function Cognito(options) {
  return {
    id: "cognito",
    name: "Cognito",
    type: "oauth",
    authorization: `${options.issuer}oauth2/authorize?scope=openid+profile+email`,
    token: `${options.issuer}oauth2/token`,
    userinfo: `${options.issuer}oauth2/userInfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.username,
        email: profile.email,
        image: null,
      }
    },
    options,
  }
}
