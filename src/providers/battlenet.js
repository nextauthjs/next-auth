export default function BattleNet(options) {
  const { region } = options
  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oauth",
    version: "2.0",
    scope: "openid",
    params: { grant_type: "authorization_code" },
    accessTokenUrl:
      region === "CN"
        ? "https://www.battlenet.com.cn/oauth/token"
        : `https://${region}.battle.net/oauth/token`,
    authorizationUrl:
      region === "CN"
        ? "https://www.battlenet.com.cn/oauth/authorize?response_type=code"
        : `https://${region}.battle.net/oauth/authorize?response_type=code`,
    profileUrl: "https://us.battle.net/oauth/userinfo",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.battletag,
        email: null,
        image: null,
      }
    },
    ...options,
  }
}
