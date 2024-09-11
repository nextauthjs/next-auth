import type { OAuthConfig, OAuthUserConfig } from "."

interface Identifier {
  identifier: string
}

interface Element {
  identifiers?: Identifier[]
}

export interface LinkedInProfile extends Record<string, any> {
  id: string
  localizedFirstName: string
  localizedLastName: string
  profilePicture: {
    "displayImage~": {
      elements?: Element[]
    }
  }
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
    userinfo: {
      url: "https://api.linkedin.com/v2/me",
      params: {
        projection: `(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))`,
      },
    },
    async profile(profile, tokens) {
      const emailResponse = await fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      )
      const emailData = await emailResponse.json()
      return {
        id: profile.id,
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        email: emailData?.elements?.[0]?.["handle~"]?.emailAddress,
        image:
          profile.profilePicture?.["displayImage~"]?.elements?.[0]
            ?.identifiers?.[0]?.identifier,
      }
    },
    style: { logo: "/linkedin.svg", bg: "#069", text: "#fff" },
    options,
  }
}
