import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface TwitchProfile extends Record<string, any> {
  sub: string
  preferred_username: string
  email: string
  picture: string
}

export default function Twitch<P extends TwitchProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    issuer: "https://id.twitch.tv/oauth2",
    id: "twitch",
    name: "Twitch",
    type: "oidc",
    authorization: {
      params: {
        scope: "openid user:read:email",
        claims: {
          id_token: {
            email: null,
            picture: null,
            preferred_username: null,
          },
        },
      },
    },
    style: {
      logo: "/twitch.svg",
      logoDark: "/twitch-dark.svg",
      bg: "#fff",
      text: "#65459B",
      bgDark: "#65459B",
      textDark: "#fff",
    },
    options,
  }
}
