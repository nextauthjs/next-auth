export default function GitLab(options) {
  return {
    id: "gitlab",
    name: "GitLab",
    type: "oauth",
    authorization: "https://gitlab.com/oauth/authorize?scope=read_user",
    token: "https://gitlab.com/oauth/token",
    profileUrl: "https://gitlab.com/api/v4/user",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    ...options,
  }
}
