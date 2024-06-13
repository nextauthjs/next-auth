/**
 * <div style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>NetSuite</b> integration.</span>
 * <a href="https://system.netsuite.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/netsuite.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/netsuite
 */

/*
 * This NetSuite provider uses OAuth 2 Features. Ensure you have an integration record and access token set up in order to use this provider.
 * Read more about OAuth 2 setup here: https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157771281570.html
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface OAuthNetSuiteOptions {
  /**
   *  The prompt options - also viewable below
   *
   *  @link https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_160855585734.html
   *
   * 	authorization.params.prompt
   *
   * The optional prompt parameter provides additional control of when the login/consent screen appears. Following are the values you can use with the prompt parameter:
   * "none" - the consent screen does not appear. If there is no active session, the application returns an error.
   * "login" - the user must authenticate even if there is an active session.
   * This option only works if the application sends the request to the account-specific domain.
   * "consent" - the consent screen appears every time. The user must authenticate if there is no active session.
   * login consent or consent login - the consent screen appears every time, and the user must authenticate even if there is an active session and allow the connection to the NetSuite. Similar to GitHub, Google, and Facebook data consent screens.
   */
  prompt: string | "none" | "login" | "consent"
  /**
   * EX: TSTDRV1234567 or 81555 for prod
   */
  accountID: string
  /**
   * restlets rest_webservices or restlets or rest_webservices suiteanalytics_connect restlets
   */
  scope: string
  /**
   * Either a restlet or suitelet returning runtime info or record info -> RESTlet recommended
   */
  userinfo: string
}

export interface NetSuiteProfile {
  // Main N/runtime.getCurrentUser() object return
  id: number
  name: string
  email: string
  location: number
  role: number
  roleId?: string
  roleCenter?: string
  contact?: number
  subsidiary?: number
  department?: number
}

/**
 * Add Netsuite login to your page and make requests to:
 * - [NetSuite RESTLets](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4567507062.html#Tracking-RESTlet-Calls-Made-with-TBA-and-OAuth-2.0).
 * - [NetSuite REST Web Services](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/book_1559132836.html#SuiteTalk-REST-Web-Services-API-Guide).
 *
 * ### Setup
 *
 * #### Disclaimer
 * By using this provider, you consent to sharing your data with NetSuite.
 * By using this provider we assume you comply with NetSuite's [Terms of Service](https://www.netsuite.com/portal/assets/pdf/terms_of_service.pdf) and [Privacy Policy](https://www.oracle.com/legal/privacy).
 * The author of this provider is not affiliated with NetSuite. Proceeding with this provider you must be a NetSuite customer and have a NetSuite account (Full access user).
 * **Ensure the OAuth 2.0 Feature is enabled in your NetSuite account with the proper permissions set up on the current role/user**
 *
 * Before setting up the provider, you will need to:
 * - [Create an Integration Record](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157771733782.html#procedure_157838925981)
 *   - Uncheck the TBA Auth Flow checkbox.
 *   - Check OAuth 2.0 Auth Flow checkbox.
 *   - Copy and paste the `Callback URL` below into the `Redirect URI` field.
 *   - Then select the scope(s) you want to use.
 *     - **REST Web Services** (`rest_webservices`) - Access to REST Web Services.
 *     - **RESTlets**(`restlets`) - Access to RESTLets.
 *     - **SuiteAnalytics Connect** (`suiteanalytics_connect`) - Access to SuiteAnalytics Connect.
 *   - Add any policies you want to use.
 *     - Application Logo (_Optional_) (Shown to users when they are asked to grant access to your application). - Consent Screen
 *     - Application Terms of Use (_Optional_) - A PDF file that contains the terms of use for your application. - Consent Screen
 *     - Application Privacy Policy (_Optional_) - A PDF file that contains the privacy policy for your application. - Consent Screen
 *   - OAuth 2.0 Consent Policy Preference - This setting determines whether the user is asked to grant access to your application **every time** they sign in or only the **first time** they sign in or **never**.
 *   - **Save** the Integration record.
 *   - The Integration record will be used to generate the `clientId` and `clientSecret` for the provider. **Save the generated values for later**
 *
 * #### Callback URL
 *
 * :::tip
 * When setting the Redirect URI in the Integration record, you must use the `https` protocol.
 * Otherwise, you will get an error when trying to sign in. (_INVALID_LOGIN_ATTEMPT_).
 * If you are testing locally, you can use a service like [ngrok](https://ngrok.com/) to create a secure tunnel to your localhost.
 * :::
 *
 * ```
 * https://example.com/api/auth/callback/netsuite
 * ```
 *
 * :::tip
 * Our `userinfo` needs to compose of a suitelet or RESTLet url that gives us the information about the user. This has to be very fast in which the handshake profile gather execution can't take long.
 * The best bet is to use the `N/runtime` module to get the basics first. - Here is an example of a RESTlet below. Be sure to deploy and enable access to "All Roles".
 * :::
 *
 * #### Example RESTLet Callback Handler
 * Be sure to deploy and use the **external** RESTLet url of any usage of the URIs.
 *
 * ```js
 * * /**
 * * @NApiVersion 2.1
 * * @NScriptType Restlet
 * *\/
 * define(["N/runtime"], /**
 *  @param{runtime} runtimee
 * \/ (runtime) => {
 *  /**
 *   * Defines the function that is executed when a GET request is sent to a RESTlet.
 *   * @param {Object} requestParams - Parameters from HTTP request URL; parameters passed as an Object (for all supported
 *   *     content types)
 *   * @returns {string | Object} HTTP response body; returns a string when request Content-Type is 'text/plain'; returns an
 *   *     Object when request Content-Type is 'application/json' or 'application/xml'
 *   * @since 2015.2
 *   *\/
 *   const get = (requestParams) => {
 *     let userObject = runtime.getCurrentUser();
 *
 *     try {
 *       log.debug({ title: "Payload received:", details: requestParams });
 *
 *       const { id, name, role, location, email, contact } = userObject;
 *
 *       log.audit({ title: "Current User Ran", details: name });
 *
 *       let user = {
 *         id,
 *         name,
 *         role,
 *         location,
 *         email,
 *         contact,
 *       };
 *
 *       log.debug({ title: "Returning user", details: user });
 *
 *       return JSON.stringify(user);
 *     } catch (e) {
 *       log.error({ title: "Error grabbing current user:", details: e });
 *     }
 *   };
 *
 *   return {
 *     get,
 *   };
 * );
 * ```
 *
 * > **Note**: Above is an example of returning the basic runtime information. Be sure to create a new script record and deployment record. Upon saving the deployment record. We will get our URLs for our RESTlet.
 *
 * ### Configuration
 *
 * ```ts
 * import { Auth } from "@auth/core"
 * import Netsuite from "@auth/core/providers/netsuite"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *       NetSuite({
 *         accountID: NETSUITE_ACCOUNT_ID, // EX: TSTDRV1234567 or 81555 for prod, and 1234567-SB1 for Sandbox accounts not "_" use "-".
 *        // Returns the current user using the N/runtime module. This url can be a suitelet or RESTlet (Recommended)
 *        // Using getCurrentUser(); So we match this schema returned from this RESTlet in the profile callback. (Required)
 *         userinfo: "https://1234567.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=123&deploy=1",
 *       })
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [NetSuite - Creating an Integration Record (OAuth 2.0)](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157771733782.html#Related-Topics)
 * - [NetSuite - Authorizing OAuth Requests](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
 * - [NetSuite - Configure OAuth Roles](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157771510070.html#Set-Up-OAuth-2.0-Roles)
 * - [Learn more about NetSuite OAuth 2.0](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_157769826287.html#OAuth-2.0)
 *
 * ### Notes
 *
 * :::tip
 * Make sure the `userinfo` matches the return type of the profile callback to ensure the user session gets read correctly.
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 * :::
 *
 */
export default function NetSuite<P extends NetSuiteProfile>(
  config: OAuthUserConfig<P> & OAuthNetSuiteOptions
): OAuthConfig<P> {
  const { accountID } = config

  return {
    id: "netsuite",
    name: "NetSuite",
    type: "oauth",
    checks: ["state"],
    authorization: {
      url: `https://${accountID}.app.netsuite.com/app/login/oauth2/authorize.nl`,
      params: { scope: "restlets rest_webservices" },
    },
    token: `https://${accountID}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`,
    profile(profile) {
      // This is the default runtime.getCurrentUser() object returned from the RESTlet or SUITELet
      return {
        id: profile.id.toString(),
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    style: { logo: "/netsuite.svg", bg: "#181a1b", text: "#fbfbfb" },
    options: config,
  }
}
