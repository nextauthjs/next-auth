import type { OAuthConfig, OAuthUserConfig } from "."

export interface OktaProfile extends Record<string, any> {
  iss: string
  ver: string
  sub: string
  aud: string
  iat: string
  exp: string
  jti: string
  auth_time: string
  amr: string
  idp: string
  nonce: string
  name: string
  nickname: string
  preferred_username: string
  given_name: string
  middle_name: string
  family_name: string
  email: string
  email_verified: string
  profile: string
  zoneinfo: string
  locale: string
  address: string
  phone_number: string
  picture: string
  website: string
  gender: string
  birthdate: string
  updated_at: string
  at_hash: string
  c_hash: string
}

export default function Okta<P extends OktaProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "okta",
    name: "Okta",
    type: "oauth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.preferred_username,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
