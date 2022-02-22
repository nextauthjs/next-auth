import type { OAuthConfig, OAuthUserConfig } from "."

export interface BattleNetProfile {
  sub: string
  battle_tag: string
}

export default function BattleNet<
  P extends Record<string, any> = BattleNetProfile
>(
  options: OAuthUserConfig<P> & {
    issuer:
      | "https://www.battlenet.com.cn/oauth"
      | `https://${"US" | "EU" | "KR" | "TW"}.battle.net/oauth`
  }
): OAuthConfig<P> {
  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
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
