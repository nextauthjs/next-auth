export default function Slack(options) {
  return {
    id: "slack",
    name: "Slack",
    type: "oauth",

    scope: [],
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://slack.com/api/oauth.v2.access",
    authorizationUrl: "https://slack.com/oauth/v2/authorize",
    authorizationParams: {
      user_scope: "identity.basic,identity.email,identity.avatar",
    },
    profileUrl: "https://slack.com/api/users.identity",
    profile(profile) {
      const { user } = profile
      return {
        id: user.id,
        name: user.name,
        image: user.image_512,
        email: user.email,
      }
    },
    ...options,
  }
}
