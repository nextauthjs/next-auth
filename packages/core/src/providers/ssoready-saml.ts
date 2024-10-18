/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>SSOReady SAML</b> integration.</span>
 * <a href="https://ssoready.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/ssoready-saml.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/ssoready-saml
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface SSOReadySAMLProfile extends Record<string, any> {
  id: string
  email: string
  organizationId: string
  organizationExternalId: string
}

/**
 * Add SSOReady SAML login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/ssoready-saml
 * ```
 *
 * #### Configuration
 *
 *```ts
 * import { Auth } from "@auth/core"
 * import SSOReadySAML from "@auth/core/providers/ssoready-saml"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     SSOReadySAML({
 *       clientId: SSOREADY_SAML_CLIENT_ID,
 *       clientSecret: SSOREADY_SAML_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [SSOReady SSO OAuth
 *   documentation](https://ssoready.com/docs/saml-over-oauth-saml-nextauth-integration)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the SSOReady SAML provider is based on the
 * [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * [SAML](https://en.wikipedia.org/wiki/SAML_2.0) is not a single identity
 * provider but rather a decentralized family of identity providers which all
 * implement the SAML protocol. You can't just "log in via SAML". You always log
 * in to a particular instance of SAML.
 *
 * To specify which instance of SAML to use, you provide to the SSOReadySAML
 * provider an `organizationExternalId`. How you determine the appropriate
 * `organizationExternalId` to provide is covered in [the SSOReady
 * docs](https://ssoready.com/docs/saml-over-oauth-saml-nextauth-integration#creating-organizations).
 *
 * If your product's notion of an organization maps one-to-one with a company's
 * domain, then you might implement SAML sign-ons like so:
 *
 * ```ts
 * const [email, setEmail] = useState("")
 *
 * // ...
 *
 * <input
 *   type="email"
 *   value={email}
 *   placeholder="Email"
 *   onChange={(event) => setEmail(event.target.value)}
 * />
 * <button
 *   onClick={() =>
 *     signIn("ssoready-saml", undefined, {
 *       organizationExternalId: email.split("@")[1],
 *     })
 *   }
 * >
 *   Sign in with SSO
 * </button>
 * ```
 *
 * The setup above presumes that you configure your organizations in SSOReady to
 * have domains (e.g. "example.com") as their external IDs.
 *
 * :::tip
 *
 * The SSOReady SAML provider comes with a [default
 * configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/ssoready-saml.ts).
 * To override the defaults for your use case, check out [customizing a built-in
 * OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an
 * issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take
 * responsibility for any deviation from the spec by the provider. You can open
 * an issue, but if the problem is non-compliance with the spec, we might not
 * pursue a resolution. You can ask for more help in
 * [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function SSOReadySAML<P extends SSOReadySAMLProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "ssoready-saml",
    name: "SSOReady SAML",
    type: "oidc",
    issuer: "https://auth.ssoready.com/v1/oauth",
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.sub,
        organizationId: profile.organizationId,
        organizationExternalId: profile.organizationExternalId,
      }
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    options,
  }
}
