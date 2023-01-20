/** @type {import(".").OAuthProvider} */
export default function Reddit(options) {
  return {
    id: "reddit",
    name: "Reddit",
    type: "oauth",
    authorization: "https://www.reddit.com/api/v1/authorize?scope=identity",
    token: "https://www.reddit.com/api/v1/access_token",
    userinfo: "https://oauth.reddit.com/api/v1/me",
    options,
  }
}
