import { OAuthConfig, OAuthUserConfig } from "."

export interface IDMeProfile extends Record<string, any> {
  iss: string
  sub: string
  aud: string
  exp: number
  iat: number
  fname: string
  lname: string
  street: string
  city: string
  state: string
  zip: string
  birthdate: string
  uuid: string
}

export default function IDMe<P extends IDMeProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "idme",
    name: "ID.me",
    type: "oauth",
    wellKnown: "https://api.id.me/oidc/.well-known/openid-configuration",
    checks: ["pkce", "state"],
    idToken: true,
    authorization: { params: { scope: `openid` } },
    profile(profile) {
      return {
        id: profile.uuid,
        name: `${profile.fname} ${profile.lname}`,
        email: profile.email,
      }
    },
    options,
  }
}
