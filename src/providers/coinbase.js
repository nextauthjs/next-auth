export default function Coinbase(options) {
  return {
    id: "coinbase",
    name: "Coinbase",
    type: "oauth",
    version: "2.0",
    scope: "wallet:user:email wallet:user:read",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://api.coinbase.com/oauth/token",
    requestTokenUrl: "https://api.coinbase.com/oauth/token",
    authorizationUrl:
      "https://www.coinbase.com/oauth/authorize?response_type=code",
    profileUrl: "https://api.coinbase.com/v2/user",
    profile(profile) {
      return {
        id: profile.data.id,
        name: profile.data.name,
        email: profile.data.email,  
        image: profile.data.avatar_url,
      }
    },
    ...options,
  }
}
