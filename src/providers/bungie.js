export default function Bungie(options) {
  return {
    id: "bungie",
    name: "Bungie",
    type: "oauth",
    version: "2.0",
    scope: "",
    params: { reauth: "true", grant_type: "authorization_code" },
    accessTokenUrl: "https://www.bungie.net/platform/app/oauth/token/",
    requestTokenUrl: "https://www.bungie.net/platform/app/oauth/token/",
    authorizationUrl:
      "https://www.bungie.net/en/OAuth/Authorize?response_type=code",
    profileUrl:
      "https://www.bungie.net/platform/User/GetBungieAccount/{membershipId}/254/",
    profile(profile) {
      const { bungieNetUser: user } = profile.Response

      return {
        id: user.membershipId,
        name: user.displayName,
        image: `https://www.bungie.net${
          user.profilePicturePath.startsWith("/") ? "" : "/"
        }${user.profilePicturePath}`,
        email: null,
      }
    },
    headers: {
      "X-API-Key": null,
    },
    clientId: null,
    clientSecret: null,
    ...options,
  }
}
