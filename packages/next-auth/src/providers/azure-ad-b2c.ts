import type { OAuthConfig, OAuthUserConfig } from "."

export interface AzureB2CProfile extends Record<string, any> {
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

export default function AzureADB2C<P extends AzureB2CProfile>(
  options: OAuthUserConfig<P> & {
    primaryUserFlow?: string
    tenantId?: string
  }
): OAuthConfig<P> {
  const { tenantId, primaryUserFlow } = options
  const issuer =
    options.issuer ??
    `https://${tenantId}.b2clogin.com/${tenantId}.onmicrosoft.com/${primaryUserFlow}/v2.0`
  return {
    id: "azure-ad-b2c",
    name: "Azure Active Directory B2C",
    type: "oauth",
    wellKnown: `${issuer}/.well-known/openid-configuration`,
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
    style: {
      logo: "/azure.svg",
      logoDark: "/azure-dark.svg",
      bg: "#fff",
      text: "#0072c6",
      bgDark: "#0072c6",
      textDark: "#fff",
    },
    options,
  }
}
