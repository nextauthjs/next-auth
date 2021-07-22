export default function Facebook(options) {
  return {
    id: "facebook",
    name: "Facebook",
    type: "oauth",
    authorization: "https://www.facebook.com/v7.0/dialog/oauth?scope=email",
    token: "https://graph.facebook.com/oauth/access_token",
    profileUrl: "https://graph.facebook.com/me?fields=email,name,picture",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture.data.url,
      }
    },
    ...options,
  }
}
