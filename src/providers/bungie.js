export default function Bungie(options) {
  return {
    id: "bungie",
    name: "Bungie",
    type: "oauth",
    authorization: "https://www.bungie.net/en/OAuth/Authorize?reauth=true",
    token: "https://www.bungie.net/platform/app/oauth/token/",
    userinfo:
      "https://www.bungie.net/platform/User/GetBungieAccount/{membershipId}/254/",
    profile(profile) {
      const { bungieNetUser: user } = profile.Response

      return {
        id: user.membershipId,
        name: user.displayName,
        email: null,
        image: `https://www.bungie.net${
          user.profilePicturePath.startsWith("/") ? "" : "/"
        }${user.profilePicturePath}`,
      }
    },
    options,
  }
}
