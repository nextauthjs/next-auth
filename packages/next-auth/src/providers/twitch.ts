import type { OAuthConfig, OAuthUserConfig } from "."

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
    wellKnown: "https://id.twitch.tv/oauth2/.well-known/openid-configuration",
    id: "twitch",
    name: "Twitch",
    type: "oauth",
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
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.preferred_username,
        email: profile.email,
        image: profile.picture,
      }
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
