import type { OAuthConfig, OAuthUserConfig } from "."

/** @see [Supported Scopes](https://docs.passage.id/hosted-login/oidc-client-configuration#supported-scopes) */
export interface PassageProfile {
  iss: string
  /** Unique identifer in Passage for the user */
  sub: string
  aud: string[]
  exp: number
  iat: number
  auth_time: number
  azp: string
  client_id: string
  at_hash: string
  c_hash: string
  /** The user's email address */
  email: string
  /** Whether the user has verified their email address */
  email_verified: boolean
  /** The user's phone number */
  phone: string
  /** Whether the user has verified their phone number */
  phone_number_verified: boolean
}

export default function Passage(
  config: OAuthUserConfig<PassageProfile>
): OAuthConfig<PassageProfile> {
  config.issuer = config.issuer?.replace(/\/$/, "")
  return {
    id: "passage",
    name: "Passage",
    type: "oauth",
    wellKnown: `${config.issuer}/.well-known/openid-configuration`,
    authorization: { params: { scope: "openid email" } },
    client: { token_endpoint_auth_method: "client_secret_basic" },
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: null,
        email: profile.email,
        image: null,
      }
    },
    style: {
      logo: "/passage.svg",
      logoDark: "/passage.svg",
      bg: "#fff",
      bgDark: "#fff",
      text: "#000",
      textDark: "#000",
    },
    options: config,
  }
}
