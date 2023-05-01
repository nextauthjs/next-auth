/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Osso</b> integration.</span>
 * <a href="https://ossoapp.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/osso.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/osso
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Add Osso login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/osso
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Osso from "@auth/core/providers/osso"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Osso({ clientId: OSSO_CLIENT_ID, clientSecret: OSSO_CLIENT_SECRET, issuer: OSSO_ISSUER })],
 * })
 * ```
 *
 * ### Resources
 * Osso is an open source service that handles SAML authentication against Identity Providers, normalizes profiles, and makes those profiles available to you in an OAuth 2.0 code grant flow.
 * 
 * - If you don't yet have an Osso instance, you can use [Osso's Demo App](https://demo.ossoapp.com) for your testing purposes. For documentation on deploying an Osso instance, see https://ossoapp.com/docs/deploy/overview/
 *  - [Osso OAuth documentation](https://ossoapp.com/)
 *
 * You can configure your OAuth Clients on your Osso Admin UI, i.e. https://demo.ossoapp.com/admin/config - you'll need to get a Client ID and Secret and allow-list your redirect URIs.
 * [SAML SSO differs a bit from OAuth](https://ossoapp.com/blog/saml-vs-oauth) - for every tenant who wants to sign in to your application using SAML, you and your customer need to perform a multi-step configuration in Osso's Admin UI and the admin dashboard of the tenant's Identity Provider. Osso provides documentation for providers like Okta and OneLogin, cloud-based IDPs who also offer a developer account that's useful for testing. Osso also provides a [Mock IDP](https://idp.ossoapp.com) that you can use for testing without needing to sign up for an Identity Provider service.

 * See Osso's complete configuration and testing documentation at https://ossoapp.com/docs/configure/overview
 * 
 * ### Notes
 *
 * By default, Auth.js assumes that the Osso provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::note
 * 
 * `issuer` should be the fully qualified domain – e.g. `demo.ossoapp.com`
 * 
 * :::
 * 
 * :::tip
 *
 * The Osso provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/osso.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function Osso(
  config: OAuthUserConfig<Record<string, any>>
): OAuthConfig<Record<string, any>> {
  return {
    id: "osso",
    name: "Osso",
    type: "oauth",
    authorization: `${config.issuer}oauth/authorize`,
    token: `${config.issuer}oauth/token`,
    userinfo: `${config.issuer}oauth/me`,
    options: config,
  }
}
