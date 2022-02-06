import { OAuthConfig, OAuthUserConfig } from "."

export interface BattleNetProfile {
  at_hash: string
  sub: string
  aud: string
  azp: string
  iss: string
  exp: number
  iat: number
  battle_tag: string
  jti: string
}

export default function BattleNet<P extends Record<string, any> = BattleNetProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * Battle.net employs several region-based concepts to manage and deliver game data:
     * https://develop.battle.net/documentation/guides/regionality-and-apis
     */
    region: string
  }
): OAuthConfig<P> {
  const { region } = options

  const base = region.toUpperCase() === "CN"
    ? "https://www.battlenet.com.cn/oauth"
    : `https://${region}.battle.net/oauth`

  return {
    id: "battlenet",
    name: "Battle.net",
    type: "oauth",
    wellKnown: `${base}/.well-known/openid-configuration`,
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
