export default function Naver(options) {
  return {
    id: "naver",
    name: "Naver",
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    protection: ["state"],
    accessTokenUrl: "https://nid.naver.com/oauth2.0/token",
    authorizationUrl:
      "https://nid.naver.com/oauth2.0/authorize?response_type=code",
    profileUrl: "https://openapi.naver.com/v1/nid/me",
    profile(profile) {
      return profile.response
    },
    ...options,
  }
}
