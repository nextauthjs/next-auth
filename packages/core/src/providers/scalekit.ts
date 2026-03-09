/**
 * <div class="provider" style={{backgroundColor: "#1c1c1e", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Scalekit</b> integration.</span>
 * <a href="https://scalekit.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/scalekit.png" height="48" />
 * </a>
 * </div>
 *
 * @module providers/scalekit
 */
import type { OIDCConfig, OAuthUserConfig } from "./index.js"

/**
 * The profile returned by Scalekit's userinfo endpoint.
 *
 * - {@link https://docs.scalekit.com/apis/userinfo | Scalekit UserInfo endpoint}
 */
export interface ScalekitProfile extends Record<string, any> {
  /** Unique user ID (`usr_...`) */
  sub: string
  email: string
  email_verified: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
  /** Organization ID (`org_...`) */
  oid: string
}

/**
 * Add Scalekit SSO login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/scalekit
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Scalekit from "@auth/core/providers/scalekit"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Scalekit({
 *       clientId: AUTH_SCALEKIT_ID,
 *       clientSecret: AUTH_SCALEKIT_SECRET,
 *       issuer: AUTH_SCALEKIT_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Add modular SSO with Scalekit](https://docs.scalekit.com/authenticate/sso/add-modular-sso/)
 * - [Scalekit SSO code samples](https://docs.scalekit.com/authenticate/sso/code-samples/)
 * - [Onboard enterprise customers](https://docs.scalekit.com/sso/guides/onboard-enterprise-customers/)
 * - [SSO integrations guide](https://docs.scalekit.com/guides/integrations/sso-integrations/)
 *
 * ### SSO Routing
 *
 * Scalekit supports multiple ways to route a user to their SSO connection.
 * Pass one of the following optional parameters to target a specific connection:
 *
 * ```ts
 * Scalekit({
 *   clientId: AUTH_SCALEKIT_ID,
 *   clientSecret: AUTH_SCALEKIT_SECRET,
 *   issuer: AUTH_SCALEKIT_ISSUER,
 *   // pick one of the following routing strategies:
 *   connectionId: "conn_...",      // exact connection (highest precedence)
 *   organizationId: "org_...",     // org's active SSO connection
 *   domain: "acme.com",            // resolve org from email domain
 * })
 * ```
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Scalekit provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * Scalekit is an enterprise SSO platform that supports SAML, OIDC, and social login
 * (Google, Microsoft, GitHub, etc.) connections. It exposes a single OIDC-compliant
 * interface, so Auth.js auto-discovers all endpoints from the issuer URL via
 * `/.well-known/openid-configuration` — no manual endpoint configuration required.
 *
 * Each Scalekit environment has a unique issuer URL of the form
 * `https://<subdomain>.scalekit.dev` (dev) or `https://<subdomain>.scalekit.com` (prod).
 * Set `AUTH_SCALEKIT_ISSUER` to this URL.
 *
 * :::tip
 *
 * The Scalekit provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/scalekit.ts).
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
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function Scalekit<P extends ScalekitProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * Your Scalekit environment URL (e.g. `https://yourenv.scalekit.dev`).
     * Used for OIDC discovery and as the token issuer.
     */
    issuer: string
    /**
     * Route the user to a specific SSO connection by its ID (`conn_...`).
     * Takes precedence over `organizationId` and `domain`.
     */
    connectionId?: string
    /**
     * Route the user to a specific organization's active SSO connection (`org_...`).
     */
    organizationId?: string
    /**
     * Route the user to the SSO connection associated with this email domain.
     */
    domain?: string
  }
): OIDCConfig<P> {
  const { issuer, connectionId, organizationId, domain } = options

  return {
    id: "scalekit",
    name: "Scalekit",
    type: "oidc",
    issuer,
    authorization: {
      params: {
        scope: "openid email profile",
        ...(connectionId && { connection_id: connectionId }),
        ...(organizationId && { organization_id: organizationId }),
        ...(domain && { domain }),
      },
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? `${profile.given_name} ${profile.family_name}`,
        email: profile.email,
        image: profile.picture ?? null,
      }
    },
    style: { bg: "#1c1c1e", text: "#fff" },
    options,
  }
}
