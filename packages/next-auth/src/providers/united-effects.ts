import type { OAuthConfig, OAuthUserConfig } from "."

export interface UnitedEffectsProfile extends Record<string, any> {
  sub: string
  email: string
}

export default function UnitedEffects<P extends UnitedEffectsProfile>(
  options: OAuthUserConfig<P> & { issuer: string }
): OAuthConfig<P> {
  return {
    id: "united-effects",
    name: "United Effects",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: {
      params: { scope: "openid email profile", resource: options.issuer },
    },
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: null,
        email: profile.email,
        image: null,
      }
    },
    options,
  }
}