/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Ory Hydra</b> integration.</span>
 * <a href="https://www.ory.sh/hydra/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/ory.svg" height="48" />
 * </a>
 * </div>
 *
 * @module providers/ory-hydra
 */
import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface OryHydraProfile extends Record<string, any> {
  iss: string
  ver: string
  sub: string
  aud: string
  iat: string
  exp: string
  jti: string
  amr: string
  email?: string
}

/**
 * Add Ory Hydra login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/hydra
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import OryHydra from "@auth/core/providers/ory-hydra"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     OryHydra({
 *       clientId: ORY_HYDRA_CLIENT_ID,
 *       clientSecret: ORY_HYDRA_CLIENT_SECRET,
 *       issuer: ORY_HYDRA_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Ory Hydra documentation](https://www.ory.sh/docs/hydra/5min-tutorial)
 *
 * ### Notes
 *
 * Ory Hydra can be setup using the default Ory Network setup or self hosted on your own
 * infrastructure.
 * By default, Auth.js assumes that the Ory Hydra provider is
 * based on the [Open ID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The Ory Hydra provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/ory-hydra.ts).
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
export default function OryHydra<P extends OryHydraProfile>(
  options: OIDCUserConfig<P>
): OIDCConfig<P> {
  return {
    id: "hydra",
    name: "Hydra",
    type: "oidc",
    style: {
      bg: "#fff",
      text: "#0F172A",
    },
    options,
  }
}
