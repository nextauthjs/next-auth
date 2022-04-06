import { AuthorizationServer, userInfoRequest } from "@panva/oauth4webapi"
import type { OAuthConfig, OAuthUserConfig } from "."

export interface FacebookProfile {
  id: string
  picture: { data: { url: string } }
}

export default function Facebook<
  P extends Record<string, any> = FacebookProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: "facebook",
    name: "Facebook",
    type: "oauth",
    authorization: "https://www.facebook.com/v11.0/dialog/oauth?scope=email",
    token: "https://graph.facebook.com/oauth/access_token",
    userinfo: {
      url: "https://graph.facebook.com/me",
      // https://developers.facebook.com/docs/graph-api/reference/user/#fields
      params: { fields: "id,name,email,picture" },
      async request({ tokens, client, provider }) {
        // @ts-expect-error
        const userinfo_endpoint = new URL(provider.userinfo?.url)
        // @ts-expect-error
        Object.entries(provider.userinfo?.params).forEach(([key, value]) => {
          userinfo_endpoint.searchParams.append(key, value as string)
        })
        const as: AuthorizationServer = {
          issuer: options.issuer as string,
          userinfo_endpoint: userinfo_endpoint.href,
        }
        return await userInfoRequest(as, client, tokens.access_token)
      },
    },
    profile(profile: P) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture.data.url,
      }
    },
    options,
  }
}
