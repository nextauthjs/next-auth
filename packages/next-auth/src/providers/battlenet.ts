import type { OAuthConfig, OAuthUserConfig } from "."

export interface BattleNetProfile {
  sub: string
  battle_tag: string
}

export default function BattleNet(
  options: { clientId: string, clientSecret: string, region: 'US' | 'EU' | 'KR' | 'TW' | 'CN' }
): OAuthConfig<BattleNetProfile> {

  const wellKnown = options.region === 'CN' 
    ? 'https://www.battlenet.com.cn/oauth/.well-known/openid-configuration' 
    : `https://us.battle.net/oauth/.well-known/openid-configuration` 

  return OAuthProvider({
    id: "battlenet",
    name: "Battle.net",
    wellKnown,
    idToken: true,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.battle_tag,
        email: null,
        image: null,
      }
    }
  })
}
