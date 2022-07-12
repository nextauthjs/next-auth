import type { OAuthConfig, OAuthUserConfig } from "."

export interface WorkOSProfile extends Record<string, any> {
  object: string
  id: string
  organization_id: string
  connection_id: string
  connection_type: string
  idp_id: string
  email: string
  first_name: string
  last_name: string
  raw_attributes: {
    id: string
    email: string
    lastName: string
    firstName: string
    picture: string
  }
}

export default function WorkOS<P extends WorkOSProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  const { issuer = "https://api.workos.com/" } = options

  return {
    id: "workos",
    name: "WorkOS",
    type: "oauth",
    authorization: `${issuer}sso/authorize`,
    token: {
      url: `${issuer}sso/token`,
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    userinfo: `${issuer}sso/profile`,
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.raw_attributes.picture ?? null,
      }
    },
    options,
  }
}
