import type { OAuthConfig, OAuthUserConfig } from "./index.js"

interface HubSpotProfile extends Record<string, any> {
  // https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information
  user: string
  user_id: string
  hub_domain: string
  hub_id: string
}

export default function HubSpot<P extends HubSpotProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "hubspot",
    name: "HubSpot",
    type: "oauth",
    authorization: {
      url: "https://app.hubspot.com/oauth/authorize",
      params: { scope: "oauth", client_id: options.clientId },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: "https://api.hubapi.com/oauth/v1/token",
    userinfo: {
      url: "https://api.hubapi.com/oauth/v1/access-tokens",
      async request({ tokens, provider }) {
        const url = `${provider.userinfo?.url}/${tokens.access_token}`

        return await fetch(url, {
          headers: { "Content-Type": "application/json" },
          method: "GET",
        }).then(async (res) => await res.json())
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
