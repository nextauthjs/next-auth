import { OAuthConfig } from "./oauth"

export interface MattermostProfile
  extends Record<string, string | number | boolean> {
  id: string
  username: string
  email: string
}

export default function mattermostProvider({
  mattermostUrl: mmUrl,
  clientId,
  clientSecret,
}: {
  mattermostUrl: string
  clientId: string
  clientSecret: string
}) {
  return {
    id: "mattermost",
    name: "Mattermost",
    type: "oauth",
    token: {
      url: `${mmUrl}/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}`,
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
        name: profile.username,
        email: profile.email,
      }
    },
    clientId,
    clientSecret,
  } satisfies OAuthConfig<MattermostProfile>
}
