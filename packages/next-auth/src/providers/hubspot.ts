import type { OAuthConfig, OAuthUserConfig } from "."

interface HubSpotProfile extends Record<string, any> {

  // TODO: figure out additional fields, for now using 
  // https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information

  user: string,
  user_id: string,

  hub_domain: string,
  hub_id: string,
}


const HubSpotConfig = {
  authorizationUrl: "https://app.hubspot.com/oauth/authorize",
  tokenUrl: "https://api.hubapi.com/oauth/v1/token",
  profileUrl: "https://api.hubapi.com/oauth/v1/access-tokens"
}

export default function HubSpot<P extends HubSpotProfile>(
  options: OAuthUserConfig<P> & { "redirectURL": string }
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
        redirect_uri: options.redirectURL,
        client_id: options.clientId,
      },

    },
    token: {
      url: HubSpotConfig.tokenUrl,
      async request(context) {

        if (!context.params.code) {
          throw new Error("Missing HubSpot authentication code in the callback request parameters")
        }
        const urlParams = new URLSearchParams({
          client_id: options.clientId,
          client_secret: options.clientSecret,
          grant_type: "authorization_code",
          redirect_uri: options.redirectURL,
          code: context.params.code,
        });
        
        const url = `${HubSpotConfig.tokenUrl}?${urlParams}`

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
        });

        const tokens = await response.json()

        return { tokens };
      },
    },
    userinfo: {
      url: HubSpotConfig.profileUrl,
      async request(context) {

        const url = `${HubSpotConfig.profileUrl}/${context.tokens.access_token}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        });

        const userInfo = await response.json();

        return { userInfo }
      }
    },
    profile(profile) {

      const { userInfo } = profile

      return {
        id: userInfo.user_id,
        name: userInfo.user,
        email: userInfo.user,

        // TODO: get image from profile once it's available 
        // Details available https://community.hubspot.com/t5/APIs-Integrations/Profile-photo-is-not-retrieved-with-User-API/m-p/325521
        image: null
      }
    },
    options,
  }
}
