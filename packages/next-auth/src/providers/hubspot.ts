import type { OAuthConfig, OAuthUserConfig } from "."

interface HubSpotProfile extends Record<string, any> {
  // TODO: figure out additional fields, for now using
  // https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information

  user: string
  user_id: string

  hub_domain: string
  hub_id: string
}

const HubSpotConfig = {
  authorizationUrl: "https://app.hubspot.com/oauth/authorize",
  tokenUrl: "https://api.hubapi.com/oauth/v1/token",
  profileUrl: "https://api.hubapi.com/oauth/v1/access-tokens",
}

export default function HubSpot<P extends HubSpotProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "hubspot",
    name: "HubSpot",
    type: "oauth",

    ...HubSpotConfig,

    authorization: {
      url: HubSpotConfig.authorizationUrl,
      params: {
        scope: "oauth",
        client_id: options.clientId,
      },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: HubSpotConfig.tokenUrl,
    userinfo: {
      url: HubSpotConfig.profileUrl,
      async request(context) {
        const url = `${HubSpotConfig.profileUrl}/${context.tokens.access_token}`

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        })

        return await response.json()
      },
    },
    profile(profile) {
      return {
        id: profile.user_id,
        name: profile.user,
        email: profile.user,

        // TODO: get image from profile once it's available
        // Details available https://community.hubspot.com/t5/APIs-Integrations/Profile-photo-is-not-retrieved-with-User-API/m-p/325521
        image: null,
      }
    },
    style: {
      logo: "/hubspot.svg",
      logoDark: "/hubspot-dark.svg",
      bg: "#fff",
      text: "#ff7a59",
      bgDark: "#ff7a59",
      textDark: "#fff",
    },
    options,
  }
}
