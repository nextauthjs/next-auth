/** @type {import(".").OAuthProvider} */
export default function TikTok(options) {
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    version: "2.0",
    authorization: {
      url: "https://www.tiktok.com/auth/authorize",
      params: {
        scope: "user.info.basic",
        client_key: options.clientId,
      },
    },
    token: {
      url: "https://open-api.tiktok.com/oauth/access_token",
      params: {
        client_key: options.clientId,
        client_secret: options.clientSecret,
      },
    },
    userinfo: "https://open-api.tiktok.com/user/info",
    profile(profile) {
      return {
        id: profile.open_id,
        name: profile.display_name,
        image: profile.avatar_url
      };
    },
    options
  }
}
