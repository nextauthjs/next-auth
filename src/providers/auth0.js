export default function Auth0(options) {
  return {
    id: "auth0",
    name: "Auth0",
    type: "oauth",
    authorization: `https://${options.domain}/authorize?scope=openid+email+profile`,
    accessTokenUrl: `https://${options.domain}/oauth/token`,
    profileUrl: `https://${options.domain}/userinfo`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture,
      }
    },
    ...options,
  }
}
