import { Profile } from ".."
import { OAuthConfig, OAuthUserConfig } from "./oauth"

export interface GoogleProfile extends Profile {
  sub: string
  picture: string
}

export default function Google<P extends GoogleProfile>(
  options: OAuthUserConfig
): OAuthConfig<P> {
  return {
    id: "google",
    name: "Google",
    type: "oauth",
    wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
