import type { OAuthConfig, OAuthUserConfig } from "."

export interface LinkedInProfile extends Record<string, any> {
  sub: string
  name: string
  email: string
  picture: string
}

export default function LinkedIn<P extends LinkedInProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "linkedin",
    name: "LinkedIn",
    type: "oauth",
    wellKnown:
      "https://www.linkedin.com/oauth/.well-known/openid-configuration",
    authorization: {
      params: { scope: "profile email openid" },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    async profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    style: {
      logo: "/linkedin.svg",
      logoDark: "/linkedin-dark.svg",
      bg: "#fff",
      text: "#069",
      bgDark: "#069",
      textDark: "#fff",
    },
    options,
  }
}
