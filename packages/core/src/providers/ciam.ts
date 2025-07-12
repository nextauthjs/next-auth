import type { OAuthConfig, OAuthUserConfig } from "./oauth.js"

/**
 * ## CIAM Provider
 *
 * This provider is designed to integrate with a CIAM (Customer Identity and Access Management) service.
 * It expects a set of endpoints to be configured for OAuth 2.0 authorization, token exchange, and user info retrieval.
 *
 * ### Configuration
 *
 * To use this provider, you must pass a configuration object with the following properties:
 *
 * - `clientId`: The client ID provided by your CIAM service.
 * - `clientSecret`: The client secret provided by your CIAM service.
 * - `authorizationUrl`: The authorization endpoint of your CIAM service.
 * - `tokenUrl`: The token endpoint of your CIAM service.
 * - `userinfoUrl`: The userinfo endpoint of your CIAM service.
 * - `issuer`: The issuer URL of your CIAM service.
 * - `jwksEndpoint`: The JWKS endpoint of your CIAM service.
 *
 * Additionally, you can override any of the default `OAuthConfig` properties.
 *
 * @param {Omit<OAuthUserConfig<Record<string, any>>, 'checks'> & {
 *   authorizationUrl: string;
 *   tokenUrl: string;
 *   userinfoUrl: string;
 *   issuer: string;
 *   jwksEndpoint: string;
 * }} options
 * @returns {OAuthConfig<Record<string, any>>}
 */
export default function CiamProvider(
  options: Omit<OAuthUserConfig<Record<string, any>>, "checks"> & {
    authorizationUrl: string
    tokenUrl: string
    userinfoUrl: string
    issuer: string
    jwksEndpoint: string
  }
): OAuthConfig<Record<string, any>> {
  return {
    id: "ciam",
    name: "CIAM",
    type: "oauth",
    checks: ["state"],
    authorization: {
      url: options.authorizationUrl,
      params: {
        scope: "openid profile",
        response_type: "code",
      },
    },
    token: options.tokenUrl,
    jwks_endpoint: options.jwksEndpoint,
    userinfo: options.userinfoUrl,
    profile(profile: any) {
      return {
        id: profile.sub,
        name: profile.sub,
        authorities: profile.authorities,
      }
    },
    ...options,
  }
}
