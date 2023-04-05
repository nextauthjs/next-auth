import { SessionToken } from "src/core/lib/cookie"
import type { OAuthConfig, OAuthUserConfig } from "."

/*
* This NetSuite provider uses OAuth 2 Features. Ensure you have an integration record and access token set up in order to use this provider.
*  Read more about Oauth 2 setup here: https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157771281570.html
*/

/**
 *  The prompt options - also viewable below
 *  
 *  https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_160855585734.html
 * 
 * 	authorization.params.prompt
 * 
    The optional prompt parameter provides additional control of when the consent screen appears. Following are the values you can use with the prompt parameter:

    "none" - the consent screen does not appear. If there is no active session, the application returns an error.

    "login" - the user must authenticate even if there is an active session.

    This option only works if the application sends the request to the account-specific domain.

    "consent" - the consent screen appears every time. The user must authenticate if there is no active session.

    login consent or consent login - the consent screen appears every time, and the user must authenticate even if there is an active session.
*/

export interface OauthNetSuiteOptions {
    clientId: string,
    clientSecret: string,
    prompt: string | 'none' | 'login' | 'consent',
    accountId: string, // EX: TSTDRV1234567 or 81555 for prod
    scope: string | 'restlets' | 'restlets rest_webservices' | 'rest_webservices',
    userInfoUrl: string, // Either a restlet or suitelet returning runtime info or record info -> RESTlet reccommended
    profileCallback: (profile, token) => {}, // Access data returned from the user info endpoint and return it into the session obj
}

export default function NetSuite(
    options: OauthNetSuiteOptions
  ) {
    return {
      id: "netsuite",
      name: "NetSuite",
      type: "oauth",
      version: "2.0",
      protection: 'state',
      headers: {redirect: 'follow'},
      checks: ["state"],
      authorization: {
        url: `https://${options.accountId}.app.netsuite.com/app/login/oauth2/authorize.nl`,
        params: {
            client_id: `${options.clientId}`,
            prompt: options?.prompt ?? 'login',
            response_type: 'code',
            scope: options.scope || 'restlets rest_webservices',
        }
    },
    token: {
        url: `https://${options.accountId}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`,
        params: {
            grant_type: "authorization_code",
        }
    },
      userinfo: `${options.userInfoUrl}`,
      profile: (profile: Object, token) => options.profileCallback(profile, token),
      clientId: `${options.clientId}`,
      clientSecret: `${options.clientSecret}`
    }
  }