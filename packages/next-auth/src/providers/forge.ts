import {
  OAuthConfig,
  OAuthUserConfig,
  TokenEndpointHandler,
} from ".";
import axios from "axios"; // TODO - verify if alternative prefered (or add to package.json?)
import qs from "qs"; // TODO - verify if alternative prefered (or add to package.json?)

// https://forge.autodesk.com/en/docs/oauth/v1/reference/http/users-@me-GET/#body-structure-200
export interface ForgeProfile extends Record<string, unknown> {
  userId: string; // The backend user ID of the profile.
  userName: string; // The username chosen by the user.
  emailId: string; // The user’s email address.
  firstName: string; // The user’s first name.
  lastName: string; // The user’s last name.
  emailVerified: boolean; // If the user’s email address has been verified.
  "2FaEnabled": boolean; // If the user has enabled two-factor authentication.
  countryCode: string; // The 2-letter ISO 3166-1 country code; set automatically when the user creates an account.
  languageCode: string; // The language set by the user.
  optin: boolean; // If the user’s account is set to receive marketing emails from Autodesk.
  lastModified: string; // The timestamp of the last time the user’s profile was modified, in the following format: YYYY-MM-DDThh:mm:ss.ss.
  profileImages: {
    // sizeX<pixels> is an integer where <pixels> represents both height and width of square profile images and values are URLs for downloading the images via HTTP.
    sizeX20: string;
    sizeX40: string;
    sizeX80: string;
  };
  websiteUrl: string; // Website URL of the user.
  eidemGuid: string; // If the EIDM GUID value is not null, then returns EIDM Identifier otherwise returns the User Id.
}

export default function Forge<P extends Record<string, any> = ForgeProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "forge",
    name: "Autodesk Forge",
    type: "oauth",
    version: "2.0",
    authorization: {
      url: "https://developer.api.autodesk.com/authentication/v1/authorize",
      params: {
        response_type: "code",
        scope: "", // https://forge.autodesk.com/en/docs/oauth/v1/developers_guide/scopes/
      },
    },
    token: {
      url: "https://developer.api.autodesk.com/authentication/v1/gettoken",
      async request({ provider, params }) {
        const response = await axios({
          method: "post",
          url: (provider.token as TokenEndpointHandler).url,
          headers: { "content-type": "application/x-www-form-urlencoded" },
          data: qs.stringify({
            client_id: options.clientId,
            client_secret: options.clientSecret,
            grant_type: "authorization_code",
            code: params.code,
            redirect_uri: provider.callbackUrl,
          }),
        });
        return {
          tokens: {
            token_type: response.data.token_type,
            expires_at: Date.now() + response.data.expires_in,
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            session_state: params.state,
          },
        };
      },
    },
    userinfo: {
      url: "https://developer.api.autodesk.com/userprofile/v1/users/@me",
    },
    async profile(profile) {
      return {
        id: profile.userId,
        name: profile.firstName + " " + profile.lastName,
        email: profile.emailId,
        image: profile.profileImages.sizeX40,
      };
    },
    options,
  };
}
