import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface PingProfile extends Record<string, any> {
  iss: string,
  sub: string,
  aud: string,
  iat: number,
  exp: number,
  acr: string,
  amr: [string],
  auth_time: number,
  at_hash: string,
  sid: string,
  preferred_username: string,
  given_name: string,
  picture: string,
  updated_at: number,
  name: string,
  family_name: string,
  email: string,
  env: string,
  org: string,
  'p1.region': string
}

/**
 * Add PingId login to your page.
 *
 * ## Documentation
 *
 * - [Create App in Ping Identity](https://docs.pingidentity.com/r/en-us/pingone/p1_add_app_worker
)
 * 
 *  ---
 * ## Example
 *
 * ```ts
 * import PingIdProvider from "next-auth/providers/ping-id";
 *
 * ...
 * providers: [
 *  PingIdProvider({
 *    clientId: process.env.PING_CLIENT_ID,
 *    clientSecret: process.env.PING_CLIENT_SECRET,
 *     issuer: process.env.PING_ISSUER
 *  })
 * ]
 * ...
 * ```
 */

export default function PingId<P extends PingProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "ping-id",
    name: "Ping Identity",
    type: "oidc",
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name ?? profile.given_name + " " + profile.family_name,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
