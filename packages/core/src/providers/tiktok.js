/** @type {import(".").OAuthProvider} */
export default function TikTok(options) {
  return {
    id: "tiktok",
    name: "TikTok",
    type: "oauth",
    version: "2.0",
    authorization: {
      url: "https://www.tiktok.com/auth/authorize/",
      params: {
        scope: "user.info.basic",
        response_type: "code",
        client_key: process.env.TIKTOK_CLIENT_KEY,
        redirect_uri: options.redirect_uri,
      },
    },
    token: {
      url: "https://open-api.tiktok.com/oauth/access_token/",
      params: {
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        grant_type: "authorization_code",
      },
    },
    userinfo: "https://open-api.tiktok.com/user/info/",
    profile(profile) {
      return {
        id: profile.open_id,
        name: profile.display_name,
        image: profile.avatar_url
      };
    },
    checks: ["state"],
    options
  }
}
