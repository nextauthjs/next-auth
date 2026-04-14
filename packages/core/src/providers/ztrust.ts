/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Ztrust</b> integration.</span>
 * <a href="https://sso.ztrust.in">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/keycloak.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/ztrust
 */
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

interface User {
  id: string
  name: string
  email: string
  image?: string
  [key: string]: any
}

export interface ztrustProfile extends Record<string, any> {
  exp: number
  iat: number
  auth_time: number
  jti: string
  iss: string
  aud: string
  sub: string
  typ: string
  azp: string
  session_state: string
  at_hash: string
  acr: string
  sid: string
  email_verified: boolean
  name: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
  picture: string
  user: User
  groups?: string[]
}

/**
 * Add Ztrust login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/ztrust
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Ztrust from "@auth/core/providers/ztrust"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Ztrust({
 *       clientId:  ZTRUST_CLIENT_ID,
 *       clientSecret: ZTRUST_CLIENT_SECRET,
 *       issuer: ZTRUST_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Ztrust OIDC documentation](https://ztrust.gitbook.io/ztrust-documentation/user-manual-ztrust-v4.1/5.-securing-applications)
 *
 * :::tip
 *
 * Create an openid-connect client in Ztrust with "confidential" as the "Access Type".
 *
 * :::
 *
 * :::note
 *
 * issuer should include the realm – e.g. https://ztrust-domain.com/realms/My_Realm_name
 *
 * :::
 * ### Notes
 *
 * By default, Auth.js assumes that the Ztrust provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The Ztrust provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/ztrust.ts).
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
export default function ZTrust<P extends ztrustProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "ztrust",
    name: "ZTrust",
    type: "oidc",
    style: { brandColor: "#428bca" },
    options,
  }
}
