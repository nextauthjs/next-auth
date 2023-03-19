import type { OIDCConfig, OAuthUserConfig } from "./index.js"

export interface ZitadelProfile extends Record<string, any> {
  amr: string // Authentication Method References as defined in RFC8176
  aud: string // The audience of the token, by default all client id's and the project id are included
  auth_time: number // Unix time of the authentication
  azp: string // Client id of the client who requested the token
  email: string // Email Address of the subject
  email_verified: boolean // if the email was verified by ZITADEL
  exp: number // Time the token expires (as unix time)
  family_name: string // The subjects family name
  given_name: string // Given name of the subject
  gender: string // Gender of the subject
  iat: number // Time of the token was issued at (as unix time)
  iss: string // Issuing domain of a token
  jti: string // Unique id of the token
  locale: string // Language from the subject
  name: string // The subjects full name
  nbf: number // Time the token must not be used before (as unix time)
  picture: string // The subjects profile picture
  phone: string // Phone number provided by the user
  phone_verified: boolean // if the phonenumber was verified by ZITADEL
  preferred_username: string // ZITADEL's login name of the user. Consist of username@primarydomain
  sub: string // Subject ID of the user
}

export default function Zitadel<P extends ZitadelProfile>(
  options: OAuthUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "zitadel",
    name: "ZITADEL",
    type: "oidc",
    options,
  }
}
