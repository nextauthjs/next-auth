import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface PingProfile extends Record<string, any> {
  iss: string
  sub: string
  aud: string
  iat: number
  exp: number
  acr: string
  amr: [string]
  auth_time: number
  at_hash: string
  sid: string
  preferred_username: string
  given_name: string
  picture: string
  updated_at: number
  name: string
  family_name: string
  email: string
  env: string
  org: string
  "p1.region": string
}

/**
 * Add PingId login to your page.
 *
 * ## Documentation
 *
 * - [Create App in Ping Identity](https://docs.pingidentity.com/r/en-us/pingone/p1_add_app_worker)
 *
 *  ---
 * ## Example
 *
 * ```ts
 * import PingId from "@auth/core/providers/ping-id"
 *
 * ...
 * providers: [
 *  PingId({
 *    clientId: AUTH_PING_ID_ID,
 *    clientSecret: AUTH_PING_ID_SECRET,
 *    issuer: PING_ID_ISSUER
 *  })
 * ]
 * ...
 * ```
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */

export default function PingId(
  options: OIDCUserConfig<PingProfile>
): OIDCConfig<PingProfile> {
  return {
    id: "ping-id",
    name: "Ping Identity",
    type: "oidc",
    options,
  }
}
