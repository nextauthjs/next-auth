/** @type {import(".").OAuthProvider} */
export default function Naver(options) {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    authorization: "https://nid.naver.com/oauth2.0/authorize",
    token: "https://nid.naver.com/oauth2.0/token",
    userinfo: "https://openapi.naver.com/v1/nid/me",
    profile(profile) {
      return {
        id: profile.response.id,
        name: profile.response.name,
        email: profile.response.email,
        image: profile.response.profile_image
      }
    },
    checks: ["state"],
    options,
  }
}
