import type { OAuthConfig, OAuthUserConfig } from "."

interface Identifier {
  identifier: string
}

export interface LinkedInProfile extends Record<string, string> {
  id: string
  name: string
  email: string
  image: string
}

export default function LinkedIn<P extends LinkedInProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "linkedin",
    name: "LinkedIn",
    type: "oauth",
    authorization: {
      url: "https://www.linkedin.com/oauth/v2/authorization",
      params: { scope: "openid profile email" },
    },
    token: "https://www.linkedin.com/oauth/v2/accessToken",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    userinfo: "https://api.linkedin.com/v2/userinfo",
    issuer: "https://www.linkedin.com",
    jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
    async profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture
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
