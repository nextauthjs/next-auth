import type { OAuthConfig, OAuthUserConfig } from "."

export interface BattleNetProfile extends Record<string, any> {
  sub: string
  battle_tag: string
}

/** See the [available regions](https://develop.battle.net/documentation/guides/regionality-and-apis) */
export type BattleNetIssuer =
  | "https://www.battlenet.com.cn/oauth"
  | `https://${"us" | "eu" | "kr" | "tw"}.battle.net/oauth`

export default function BattleNet<P extends BattleNetProfile>(
  options: OAuthUserConfig<P> & { issuer: BattleNetIssuer }
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
    style: {
      logo: "/battlenet.svg",
      logoDark: "/battlenet-dark.svg",
      bg: "#fff",
      text: "#148eff",
      bgDark: "#148eff",
      textDark: "#fff",
    },
    options,
  }
}
