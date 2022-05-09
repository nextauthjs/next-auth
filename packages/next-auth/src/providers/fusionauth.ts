import { OAuthConfig, OAuthUserConfig } from "./oauth"

/** This is the default openid signature returned from FusionAuth
 * it can be customized using [lambda functions](https://fusionauth.io/docs/v1/tech/lambdas)
 */
export interface FusionAuthProfile extends Record<string, any> {
  aud: string
  exp: number
  iat: number
  iss: string
  sub: string
  jti: string
  authenticationType: string
  email: string
  email_verified: boolean
  preferred_username: string
  at_hash: string
  c_hash: string
  scope: string
  sid: string
}

export default function FusionAuth<P extends FusionAuthProfile>(
  // tenantId only needed if there is more than one tenant configured on the server
  options: OAuthUserConfig<P> & { tenantId?: string }
): OAuthConfig<P> {
  return {
    id: "fusionauth",
    name: "FusionAuth",
    type: "oauth",
    wellKnown: options?.tenantId
      ? `${options.issuer}/.well-known/openid-configuration?tenantId=${options.tenantId}`
      : `${options.issuer}/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: "openid offline_access",
        ...(options?.tenantId && { tenantId: options.tenantId }),
      },
    },
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile?.preferred_username,
      }
    },
    options,
  }
}
