import type { OAuthConfig, OAuthUserConfig } from "./index.ts"

export interface RSOProfile extends Record<string, any> {
  /** the user's encrypted riot games `puuid` */
  id: string
  /** the user's encrypted riot games `puuid` */
  sub: string
  /** the user's region id */
  cpid: string | null
  /** random id?  */
  jiti: string
}

/**
 * Add Riot Sign On to your website.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/rso
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import RSO from "@auth/core/providers/rso"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [RSO({ clientId: RSO_CLIENT_ID, clientSecret: RSO_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Riot Sign On google docs](https://docs.google.com/document/u/0/d/e/2PACX-1vTSthxkWOIqPFe8Xqqjv4Ona5pRa5W3X6bLg4I47X15gJjG9ae-HU5a0by7VIVLWdPMgB9fTr5gvQcY/pub?pli=1)
 *  - [App Registration](https://developer.riotgames.com/)
 *  - [Riot Sign On Registration (after your app registration is approved)](https://beta.developer.riotgames.com/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the RSO provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 * 
 * Riot Sign On currently does not allow local development so you need to have a public domain to test it or create a proxy in your environment.
 *
 * :::tip
 *
 * The RSO provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/rso.ts).
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
export default function RSO<P extends RSOProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    issuer: "https://auth.riotgames.com",
    id: "rso",
    name: "Riot Sign On",
    type: "oauth",
    wellKnown: "https://auth.riotgames.com/.well-known/openid-configuration",
    userinfo: "https://auth.riotgames.com/userinfo",
    jwks_endpoint: "https://auth.riotgames.com/jwks.json",
    authorization: {
      url: "https://auth.riotgames.com/authorize",
        params: {
          /**
           * The `scope` parameter always requires `openid`. Additional scopes like `offline_access`, `access_tokens` and `cpid` can be added.
           * https://docs.google.com/document/u/0/d/e/2PACX-1vTSthxkWOIqPFe8Xqqjv4Ona5pRa5W3X6bLg4I47X15gJjG9ae-HU5a0by7VIVLWdPMgB9fTr5gvQcY/pub?pli=1
           * ## Scopes
           * `openid` is required to authenticate
           * 
           * `offline_access` is required to get a refresh token
           * 
           * `access_tokens` is required to get an access token that have access to the  `https://auth.riotgames.com/userinfo` or `https://{cluster}.api.riotgames.com/riot/account/v1/accounts/me` endpoint with more information.
           * 
           * `cpid` is required to get the user's region id
           */
          scope: "openid offline_access access_tokens cpid",
        },
    },
    token: {
      url: "https://auth.riotgames.com/token",
      async request(context) {
        const { provider, params: parameters, checks, client } = context;
        const { callbackUrl } = provider;

        console.warn("Code: " + parameters.code);

        const tokenset = await client.grant({
          grant_type: "authorization_code",
          code: parameters.code,
          redirect_uri: callbackUrl,
          code_verifier: checks.code_verifier,
          client_id: process.env.RSO_CLIENT_ID,
          client_secret: process.env.RSO_CLIENT_SECRET,
        });

        return { tokens: tokenset };
      },
     },
    profile(profile) {
      return {
        id: profile.id,
        sub: profile.sub,
        cpid: profile?.cpid,
        jiti: profile.jiti,
      }
    },
    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/riot-games.svg",
      bg: "#fff",
      text: "#fff",
    },
    options,
  }
}
