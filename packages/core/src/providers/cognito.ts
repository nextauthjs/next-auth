/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Cognito</b> integration.</span>
 * <a href="https://docs.aws.amazon.com/cognito">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/cognito.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/cognito
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface CognitoProfile extends Record<string, any> {
  sub: string
  name: string
  email: string
  picture: string
}

/**
 * Add Cognito login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/cognito
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Cognito from "@auth/core/providers/cognito"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Cognito({
 *       clientId: COGNITO_CLIENT_ID,
 *       clientSecret: COGNITO_CLIENT_SECRET,
 *       issuer: COGNITO_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Cognito OAuth documentation](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html)
 *
 * ### Notes
 * You need to select your AWS region to go the the Cognito dashboard.
 *
 * :::tip
 * The issuer is a URL, that looks like this: https://cognito-idp.{region}.amazonaws.com/{PoolId}
 * :::
 * `PoolId` is from General Settings in Cognito, not to be confused with the App Client ID.
 * :::warning
 * Make sure you select all the appropriate client settings or the OAuth flow will not work.
 * :::
 *
 * By default, Auth.js assumes that the Cognito provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The Cognito provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/cognito.ts).
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
export default function Cognito<P extends CognitoProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "cognito",
    name: "Cognito",
    type: "oidc",
    style: {
      brandColor: "#C17B9E",
    },
    options,
  }
}
