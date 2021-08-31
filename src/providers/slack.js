/** @type {import(".").OAuthProvider} */
export default function Slack(options) {
  return {
    id: "slack",
    name: "Slack",
    type: "oauth",
    authorization: {
      url: "https://slack.com/oauth/v2/authorize",
      params: {
        user_scope: "identity.basic,identity.email,identity.avatar",
      },
    },
    token: "https://slack.com/api/oauth.v2.access",
    userinfo: "https://slack.com/api/users.identity",
    profile(profile) {
      return {
        id: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        image: profile.user.image_512,
      }
    },
    options,
  }
}
