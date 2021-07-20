export default function BattleNet(options) {
  const { region } = options
  const base =
    region === "CN"
      ? "https://www.battlenet.com.cn/oauth"
      : `https://${region}.battle.net/oauth`

  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oauth",
    authorization: `${base}/authorize`,
    accessTokenUrl: `${base}/token`,
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
