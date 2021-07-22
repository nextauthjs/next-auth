export default function Google(options) {
  return {
    id: "google",
    name: "Google",
    type: "oauth",
    authorization: {
      url: "https://accounts.google.com/o/oauth2/auth",
      scope:
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
    },
    token: "https://accounts.google.com/o/oauth2/token",
    profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    ...options,
  }
}
