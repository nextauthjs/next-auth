/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>SailPoint Identity Secure Cloud</b> integration.</span>
 * <a href="https://sailpoint.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/sailpoint.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/sailpoint
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface IdentitySecureCloudProfile extends Record<string, any> {
  tenant: string;
  id: string;
  uid: string;
  email: string;
  phone: string;
  workPhone: string;
  firstname: string;
  lastname: string;
  capabilities: string[];
  displayName: string;
  name: string;
}

/**
 * Add SailPoint Identity Secure Cloud login to your page and make requests to [Identity Secure Cloud APIs](https://developer.sailpoint.com/docs/api/authentication).
 * SailPoint Identity Secure Cloud is a multi-tenant SaaS solution for Identity and Access Management. 
 * It easy to rapidly and efficiently deploy enterprise-grade Identity Security services from the cloud.
 *
 * ### Setup
 * 
 * #### Preparation
 * In order to integrate with SailPoint Identity Secure Cloud provider, user must have an existing tenant, additional Oauth information can then be retrieved at: 
 * https://{tenant}.api.identitynow.com/oauth/info
 * Please follow the guide under [Choose authorization grant flow](https://developer.sailpoint.com/docs/api/authentication#choose-authorization-grant-flow) to create OAuth Client.
 *
 * #### Callback URL
 * ```
 *https://example.com/api/auth/callback/identitySecureCloud
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import SailPoint from "@auth/core/providers/sailpoint"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [SailPoint({
 *      baseUrl: https://{tenant}.identitynow.com/
 *      clientId: IDENTITY_SECURE_CLOUD_CLIENT_ID, 
 *      clientSecret: IDENTITY_SECURE_CLOUD_SECRET,
 *      scope: sp:scopes:all
 *   })],
 * })
 * ```
 *
 * ### Resources
 *
 * - [SailPoint Identity Secure Cloud - Authentication](https://developer.sailpoint.com/docs/api/authentication)
 * - [SailPoint Identity Secure Cloud - Authorization](https://developer.sailpoint.com/docs/api/authorization)
 * - [SailPoint Developer Community](https://developer.sailpoint.com/discuss/)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the SailPoint Identity Secure Cloud provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The SailPoint Identity Secure Cloud provider comes with a default configurations by using AUTHORIAZTION_CODE and REFRESH_TOKE to retrive access_token.
 * Additional callbacks functions may be required to fully automate refresh token implementation. 
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [SailPoint Developer Community](https://developer.sailpoint.com/discuss/).
 *
 * :::
 */

export default function SailPoint(
    config: OAuthUserConfig<IdentitySecureCloudProfile> & {
      baseUrl: string,
      apiUrl: string,
      clientId: string,
      clientSecret: string,
      scope: string
    }
  ): OAuthConfig<IdentitySecureCloudProfile> {
  
    return {
      id: "identitySecureCloud",
      name: "Identity Secure Cloud",
      type: "oauth",
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      authorization: {
        url: `${config.baseUrl}/oauth/authorize`,
        params: { scope: config.scope },
      },
      token: `${config.apiUrl}/oauth/token`,
      userinfo: `${config.apiUrl}/oauth/userinfo`,
      profile(profile: IdentitySecureCloudProfile) {
        return {
            tenant: profile.tenant,
            id: profile.id,
            uid: profile.uid,
            email: profile.email,
            phone: profile.phone,
            workPhone: profile.workPhone,
            firstname: profile.firstname,
            lastname: profile.lastname,
            capabilities: profile.capabilities,
            displayName: profile.displayName,
            name: profile.uid,
        }
      },
      style: { text: "#fff", bg: "#011E69", logo: 'sailpoint.svg' },
      options: config,
    }
}
