import type { OAuthConfig, OAuthUserConfig } from "."

export interface AzureB2CProfile {
  exp: number
  nbf: number
  ver: string
  iss: string
  sub: string
  aud: string
  iat: number
  auth_time: number
  oid: string
  country: string
  name: string
  postalCode: string
  emails: string[]
  tfp: string
}

export default function AzureADB2C<
  P extends Record<string, any> = AzureB2CProfile
>(
  options: OAuthUserConfig<P> & {
    primaryUserFlow: string
    tenantId: string
  }
): OAuthConfig<P> {
  const { tenantId, primaryUserFlow } = options
  return {
    id: "azure-ad-b2c",
    name: "Azure Active Directory B2C",
    type: "oauth",
    wellKnown: `https://${tenantId}.b2clogin.com/${tenantId}.onmicrosoft.com/${primaryUserFlow}/v2.0/.well-known/openid-configuration`,
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.emails[0],
        // TODO: Find out how to retrieve the profile picture
        image: null,
      }
    },
    options,
  }
}
