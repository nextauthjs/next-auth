import { Profile } from "src"
import { OAuthConfig, OAuthUserConfig } from "./oauth"

export interface FacebookProfile extends Profile {
  id: string
  picture: { data: { url: string } }
}

export default function Facebook<P extends FacebookProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return await client.userinfo(tokens.access_token!, {
          // @ts-expect-error
          params: provider.userinfo?.params,
        })
      },
    },
    profile(profile) {
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
