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
    type: "oidc",
    authorization: {
      params: { scope: "openid email profile", resource: options.issuer },
    },
    options,
  }
}
