import type { OAuthConfig, OAuthUserConfig } from "."

interface HubspotProfile extends Record<string, any> {

  // TODO: figure out additional fields, for now using 
  // https://legacydocs.hubspot.com/docs/methods/oauth2/get-access-token-information

  user: string,
  user_id: string,

  hub_domain: string,
  hub_id: string,
}




export default function Hubspot<P extends HubspotProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "hubspot",
    name: "Hubspot",
    type: "oauth",
    authorization: {
      url: "https://app.hubspot.com/oauth/authorize",
      params: {
        scope: "oauth contacts",
        //redirect_uri: options.redirect_uri,
      },

    },
    token: "https://api.hubapi.com/oauth/v1/token",
    userinfo: "https://api.hubspot.com/oauth/v1/refresh-tokens/",
    profile(profile) {
      return {
        id: profile.user_id,
        name: profile.user,
        email: profile.user,

        // TODO: get image from profile once it's available 
        // Details available https://community.hubspot.com/t5/APIs-Integrations/Profile-photo-is-not-retrieved-with-User-API/m-p/325521
        image: "https://avatars.hubspot.net/default-100",
      }
    },
    options,
  }
}
