import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface TwitchProfile extends Record<string, any> {
  sub: string
  preferred_username: string
  email: string
  picture: string
}

export default function Twitch(
  config: OIDCUserConfig<TwitchProfile>
): OIDCConfig<TwitchProfile> {
  return {
    issuer: "https://id.twitch.tv/oauth2",
    id: "twitch",
    name: "Twitch",
    type: "oidc",
    client: { token_endpoint_auth_method: "client_secret_post" },
    authorization: {
      params: {
        scope: "openid user:read:email",
        claims: {
          id_token: { email: null, picture: null, preferred_username: null },
        },
      },
    },
    token: {
      async conform(response) {
        const body = await response.json()
        if (response.ok) {
          if (typeof body.scope === "string") {
            console.warn(
              "'scope' is a string. Redundant workaround, please open an issue."
            )
          } else if (Array.isArray(body.scope)) {
            body.scope = body.scope.join(" ")
            return new Response(JSON.stringify(body), response)
          } else if ("scope" in body) {
            delete body.scope
            return new Response(JSON.stringify(body), response)
          }
        } else {
          const { message: error_description, error } = body
          if (typeof error !== "string") {
            return new Response(
              JSON.stringify({ error: "invalid_request", error_description }),
              response
            )
          }
          console.warn(
            "Response has 'error'. Redundant workaround, please open an issue."
          )
        }
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
    options: config,
  }
}
