/** @type {import(".").OAuthProvider} */
export default function VK(options) {
  const apiVersion = "5.126" // https://vk.com/dev/versions

  return {
    id: "vk",
    name: "VK",
    type: "oauth",
    authorization: `https://oauth.vk.com/authorize?scope=email&v=${apiVersion}`,
    token: `https://oauth.vk.com/access_token?v=${apiVersion}`,
    userinfo: `https://api.vk.com/method/users.get?fields=photo_100&v=${apiVersion}`,
    profile(result) {
      const profile = result.response?.[0] ?? {}
      return {
        id: profile.id,
        name: [profile.first_name, profile.last_name].filter(Boolean).join(" "),
        email: profile.email,
        image: profile.photo_100,
      }
    },
    options,
  }
}
