import type { OAuthConfig, OAuthUserConfig } from "."

export interface EVEOnlineProfile {
  CharacterID: number
  CharacterName: string
  ExpiresOn: string
  Scopes: string
  TokenType: string
  CharacterOwnerHash: string
  IntellectualProperty: string
}

export default function EVEOnline<
  P extends Record<string, any> = EVEOnlineProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "eveonline",
    name: "EVE Online",
    type: "oauth",
    wellKnown:
      "https://login.eveonline.com/.well-known/oauth-authorization-server",
    authorization: {
      params: {
        scope: "publicData",
      },
    },
    idToken: true,
    profile(profile) {
      return {
        id: profile.CharacterID,
        name: profile.CharacterName,
        email: null,
        image: `https://image.eveonline.com/Character/${profile.CharacterID}_128.jpg`,
      }
    },
    options,
  }
}
