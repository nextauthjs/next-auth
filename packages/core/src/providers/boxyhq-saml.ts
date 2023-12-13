/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>BoxyHQ SAML</b> integration.</span>
 * <a href="https://boxyhq.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/boxyhq-saml.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/boxyhq-saml
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface BoxyHQSAMLProfile extends Record<string, any> {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

/**
 * Add BoxyHQ SAML login to your page.
 *
 * BoxyHQ SAML is an open source service that handles the SAML SSO login flow as an OAuth 2.0 flow, abstracting away all the complexities of the SAML protocol. Enable Enterprise single-sign-on in your app with ease.
 *
 * You can deploy BoxyHQ SAML as a separate service or embed it into your app using our NPM library. [Check out the documentation for more details](https://boxyhq.com/docs/jackson/deploy)
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/boxyhq-saml
 * ```
 *
 * #### Configuration
 *
 * For OAuth 2.0 Flow:
 *```js
 * import Auth from "@auth/core"
 * import BoxyHQ from "@auth/core/providers/boxyhq-saml"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [BoxyHQ({
 *    authorization: { params: { scope: "" } }, // This is needed for OAuth 2.0 flow, otherwise default to openid
 *    clientId: BOXYHQ_SAML_CLIENT_ID,
 *    clientSecret: BOXYHQ_SAML_CLIENT_SECRET,
 *    issuer: BOXYHQ_SAML_ISSUER
 *   })],
 * })
 * ```
 * For OIDC Flow:
 *
 *```js
 * import Auth from "@auth/core"
 * import BoxyHQ from "@auth/core/providers/boxyhq-saml"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [BoxyHQ({
 *    clientId: BOXYHQ_SAML_CLIENT_ID,
 *    clientSecret: BOXYHQ_SAML_CLIENT_SECRET,
 *    issuer: BOXYHQ_SAML_ISSUER
 *   })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [BoxyHQ OAuth documentation](https://example.com)
 *
 * ## Configuration
 *
 * SAML login requires a configuration for every tenant of yours. One common method is to use the domain for an email address to figure out which tenant they belong to. You can also use a unique tenant ID (string) from your backend for this, typically some kind of account or organization ID.
 *
 * Check out the [documentation](https://boxyhq.com/docs/jackson/saml-flow#2-saml-config-api) for more details.
 *
 *
 * On the client side you'll need to pass additional parameters `tenant` and `product` to the `signIn` function. This will allow BoxyHQL SAML to figure out the right SAML configuration and take your user to the right SAML Identity Provider to sign them in.
 *
 * ```tsx
 * import { signIn } from "next-auth/react";
 * ...
 *
 *   // Map your users's email to a tenant and product
 *   const tenant = email.split("@")[1];
 *   const product = 'my_awesome_product';
 * ...
 *   <Button
 *     onClick={async (event) => {
 *       event.preventDefault();
 *
 *       signIn("boxyhq-saml", {}, { tenant, product });
 *     }}>
 * ...
 * ```
 * ### Notes
 *
 * By default, Auth.js assumes that the BoxyHQ provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The BoxyHQ provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/boxyhq-saml.ts).
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
export default function SAMLJackson<P extends BoxyHQSAMLProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "boxyhq-saml",
    name: "BoxyHQ SAML",
    type: "oauth",
    authorization: {
      url: `${options.issuer}/api/oauth/authorize`,
      params: { provider: "saml" },
    },
    token: `${options.issuer}/api/oauth/token`,
    userinfo: `${options.issuer}/api/oauth/userinfo`,
    profile(profile) {
      return {
        id: profile.id,
        email: profile.email,
        name: [profile.firstName, profile.lastName].filter(Boolean).join(" "),
        image: null,
      }
    },
    options,
  }
}
