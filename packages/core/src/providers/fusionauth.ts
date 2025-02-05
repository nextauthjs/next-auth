/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>FusionAuth</b> integration.</span>
 * <a href="https://fusionauth.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/fushionauth.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/fusionauth
 */
import type { OAuthConfig, OAuthUserConfig } from "./oauth.js"

/**
 * This is the default openid signature returned from FusionAuth
 * it can be customized using [lambda functions](https://fusionauth.io/docs/v1/tech/lambdas)
 */
export interface FusionAuthProfile extends Record<string, any> {
  aud: string
  exp: number
  iat: number
  iss: string
  sub: string
  jti: string
  authenticationType: string
  email: string
  email_verified: boolean
  preferred_username?: string
  name?: string
  given_name?: string
  middle_name?: string
  family_name?: string
  at_hash: string
  c_hash: string
  scope: string
  sid: string
  picture?: string
}

/**
 * Add FusionAuth login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/fusionauth
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import FusionAuth from "@auth/core/providers/fusionauth"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     FusionAuth({
 *       clientId: FUSIONAUTH_CLIENT_ID,
 *       clientSecret: FUSIONAUTH_CLIENT_SECRET,
 *       tenantId: FUSIONAUTH_TENANT_ID,
 *       issuer: FUSIONAUTH_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 * :::warning
 * If you're using multi-tenancy, you need to pass in the tenantId option to apply the proper theme.
 * :::
 *
 * ### Resources
 *
 *  - [FusionAuth OAuth documentation](https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the FusionAuth provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * ## Configuration
 * :::tip
 * An application can be created at https://your-fusionauth-server-url/admin/application.
 *
 * For more information, follow the [FusionAuth 5-minute setup guide](https://fusionauth.io/docs/v1/tech/5-minute-setup-guide).
 * :::
 *
 * In the OAuth settings for your application, configure the following.
 *
 * - Redirect URL
 *   - https://localhost:3000/api/auth/callback/fusionauth
 * - Enabled grants
 *   - Make sure _Authorization Code_ is enabled.
 *
 * If using JSON Web Tokens, you need to make sure the signing algorithm is RS256, you can create an RS256 key pair by
 * going to Settings, Key Master, generate RSA and choosing SHA-256 as algorithm. After that, go to the JWT settings of
 * your application and select this key as Access Token signing key and Id Token signing key.
 * :::tip
 *
 * The FusionAuth provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/fusionauth.ts).
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
export default function FusionAuth<P extends FusionAuthProfile>(
  // tenantId only needed if there is more than one tenant configured on the server
  options: OAuthUserConfig<P> & { tenantId?: string }
): OAuthConfig<P> {
  return {
    id: "fusionauth",
    name: "FusionAuth",
    type: "oidc",
    wellKnown: options?.tenantId
      ? `${options.issuer}/.well-known/openid-configuration?tenantId=${options.tenantId}`
      : `${options.issuer}/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: "openid offline_access email profile",
        ...(options?.tenantId && { tenantId: options.tenantId }),
      },
    },
    userinfo: `${options.issuer}/oauth2/userinfo`,
    // This is due to a known processing issue
    // TODO: https://github.com/nextauthjs/next-auth/issues/8745#issuecomment-1907799026
    token: {
      url: `${options.issuer}/oauth2/token`,
      conform: async (response: Response) => {
        if (response.status === 401) return response

        const newHeaders = Array.from(response.headers.entries())
          .filter(([key]) => key.toLowerCase() !== "www-authenticate")
          .reduce(
            (headers, [key, value]) => (headers.append(key, value), headers),
            new Headers()
          )

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        })
      },
    },
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name:
          profile.name ??
          profile.preferred_username ??
          [profile.given_name, profile.middle_name, profile.family_name]
            .filter((x) => x)
            .join(" "),
        image: profile.picture,
      }
    },
    options,
  }
}
