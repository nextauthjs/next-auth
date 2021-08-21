export default function GitHub(options) {
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    authorization: "https://github.com/login/oauth/authorize?scope=read:user+user:email",
    token: "https://github.com/login/oauth/access_token",
    userinfo: "https://api.github.com/user",
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    options,
  }
}
