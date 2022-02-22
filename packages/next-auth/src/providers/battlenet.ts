import type { OAuthConfig, OAuthUserConfig } from "."

export interface BattleNetProfile {
  sub: string
  battle_tag: string
}

export default function BattleNet<
  P extends Record<string, any> = BattleNetProfile
>(
  options: OAuthUserConfig<P> & {
    region: "US" | "EU" | "KR" | "TW" | "CN"
  }
): OAuthConfig<P> {
  const { region } = options
  const domain =
    region === "CN"
      ? "https://www.battlenet.com.cn"
      : `https://${region}.battle.net`

  return {
    id: "battlenet",
    name: "Battle.net",
    wellKnown: `${domain}/oauth/.well-known/openid-configuration`,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.battle_tag,
        email: null,
        image: null,
      }
    },
    options,
  }
}
