
export default function FortyTwo(options) {
  return {
    id: "trovo",
    name: "Trovo",
    type: "oauth",
    version: "2.0",
    scope: "user_details_self",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: `https://${options.domain}/access_token`,
    authorizationUrl: "https://open.trovo.live/page/login.html",
    getUserInfo: "https://open-api.trovo.live/openplatform/getuserinfo",
    profile: (profile) => ({
      id: profile.userID,
      name: profile.userName,
      email: profile.email,
      image: profile.profilePic,
    }),
    ...options,
  }
}
