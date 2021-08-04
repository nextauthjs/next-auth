export default function Naver(options) {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    authorization: "https://nid.naver.com/oauth2.0/authorize",
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: "https://openapi.naver.com/v1/nid/me",
    profile(profile) {
      // REVIEW: By default, we only want to expose the
      // "id", "name", "email" and "image" fields.
      return profile.response
    },
    checks: ["state"],
    options,
  }
}
