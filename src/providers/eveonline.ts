import { Profile } from ".."
import { OAuthConfig, OAuthUserConfig } from "./oauth"

export interface EVEOnlineProfile extends Profile {
  CharacterID: number;
  CharacterName: string;
  ExpiresOn: string;
  Scopes: string;
  TokenType: string;
  CharacterOwnerHash: string;
  IntellectualProperty: string;
}

export default function EVEOnline<P extends Record<string, any> = EVEOnlineProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "eveonline",
    name: "EVE Online",
    type: "oauth",
    token: "https://login.eveonline.com/oauth/token",
    userinfo: "https://login.eveonline.com/oauth/verify",
    authorization: {
      params: { scope: "publicData" },
      url: "https://login.eveonline.com/oauth/authorize",
    },
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
