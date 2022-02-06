import type { OAuthConfig, OAuthUserConfig } from "."

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
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  
  options.issuer = options.issuer ?? 'https://us.battle.net/oauth'

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
