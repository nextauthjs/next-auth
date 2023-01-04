import { OAuthConfig } from "./oauth"

export interface MattermostProfile extends Record<string, any> {
  id: string
  username: string
  email: string
}

export default function mattermostProvider({
  mattermostUrl: mmUrl,
  clientId: client_id,
  clientSecret: client_secret,
}: {
  mattermostUrl: string
  clientId: string
  clientSecret: string
  callbackUrl: string
}) {
  return {
    id: "mattermost",
    name: "Mattermost",
    type: "oauth",
    token: {
      url: `${mmUrl}/oauth/access_token?client_id=${client_id}&client_secret=${client_secret}`,
    },
    authorization: `${mmUrl}/oauth/authorize`,
    userinfo: {
      async request({ tokens }) {
        const profile = await fetch(new URL(`${mmUrl}/api/v4/users/me`), {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }).then(async (res) => await res.json())
        return profile
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
      }
    },
    clientId: client_id,
    clientSecret: client_secret,
  } satisfies OAuthConfig<MattermostProfile>
}
