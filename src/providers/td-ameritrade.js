export default function TDAmeritrade(options) {
  return {
    id: "td",
    name: "TD Ameritrade",
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: "https://api.tdameritrade.com/v1/oauth2/token",
    requestTokenUrl: "https://api.tdameritrade.com/v1/oauth2/token",
    authorizationUrl: `https://auth.tdameritrade.com/auth?response_type=code`,
    profileUrl: `https://api.tdameritrade.com/v1/accounts`,
    profile(accounts) {
      return {
        id: accounts[0].securitiesAccount.accountId,
      }
    },
    ...options,
  }
}
