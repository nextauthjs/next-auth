/** @type {import(".").OAuthProvider} */
export default function Binance(options){
    return {
        id: "binance",
        name: "Binance",
        type: "oauth",
        version: "2.0",
        scope: "user email",
        params: { grant_type: "authorization_code" },
        accessTokenUrl: "https://accounts.binance.com/oauth/token",
        authorizationUrl:
            "https://accounts.binance.com/en/oauth/authorize?response_type=code",
        profileUrl: "https://accounts.binance.com/oauth-api/user-info",
        idToken: true,
        clientId: null,
        clientSecret: null,
        profile(profile) {
            return {
                id: profile.data.id,
                email: profile.data.email
            }
        },
        ...options,
    }
}
