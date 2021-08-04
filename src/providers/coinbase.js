export default function Coinbase(options) {
  return {
    id: "coinbase",
    name: "Coinbase",
    type: "oauth",
    authorization:
      "https://www.coinbase.com/oauth/authorize?scope=wallet:user:email+wallet:user:read",
    token: "https://api.coinbase.com/oauth/token",
    userinfo: "https://api.coinbase.com/v2/user",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: profile.data.email,
        image: profile.data.avatar_url,
      }
    },
    options,
  }
}
