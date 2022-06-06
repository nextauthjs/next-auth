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
  clientId: process.env.HUBSPOT_CLIENT_ID ?? "DEFAULT_CLIENT_ID",
  clientSecret: process.env.HUBSPOT_CLIENT_SECRET ?? "DEFAULT_CLIENT_SECRET",
  redirectUri: process.env.HUBSPOT_REDIRECT_URI ?? "DEFAULT_REDIRECT_URI",
  authorizationUrl: "https://app.hubspot.com/oauth/authorize",
  tokenUrl: "https://api.hubapi.com/oauth/v1/token",
  profileUrl: "https://api.hubapi.com/oauth/v1/access-tokens/"
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
        scope: "oauth contacts",
        redirect_uri: HubSpotConfig.redirectUri,
        client_id: HubSpotConfig.clientId,
      },

    },
    token: {
      url: HubSpotConfig.tokenUrl,
      async request(context) {

        const url = HubSpotConfig.tokenUrl + "?" +
          new URLSearchParams({
            client_id: HubSpotConfig.clientId,
            client_secret: HubSpotConfig.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: HubSpotConfig.redirectUri,
            code: context.params.code ?? "DEFAULT_CODE",
          });

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
        image: "https://avatars.hubspot.net/default-100",
      }
    },
    options,
  }
}
