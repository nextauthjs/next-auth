import type { Profile } from "../types.js"
import type {
  CommonProviderOptions,
  OIDCConfig,
  OIDCUserConfig,
} from "./index.js"
/**
 * <div class="provider" style={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
 * <span>Built-in <b>a12n-server</b> integration.</span>
 * <a href="https://github.com/.org">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/a12n-server.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/a12n-server
 */

export interface A12nServerProfile
  extends Record<keyof CommonProviderOptions, string> {
  id: string
  /* The provider name used on the default sign-in page's sign-in button. */
  name: string
  token_type?: "bearer" | "refresh_token"
  type: "oidc"
}

/**
 * Add a12n-server login to your page.
 *
 * ### Setup
 *
 * In `.env` create the following entries:
 * {@link https://github.com/curveball/next-a12n?tab=readme-ov-file#environment-variables}
 * ```
 * AUTH_A12N_ISSUER=
 * AUTH_A12N_ID=
 * AUTH_A12N_SECRET=
 * ```
 *
 * #### Callback URL
 * ```
 * https://your-site-or-backend.com/api/auth/callback/a12n-server
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import a12n from "@auth/core/providers/a12n-server"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     a12n({
 *     clientId: process.env.AUTH_A12N_ID,
 *     clientSecret: process.env.AUTH_A12N_SECRET
 *    }),
 *   ]
 * })
 * ```
 *
 * ### Resources
 *
 * - a12n-server [Overview](https://github.com/curveball/a12n-server/blob/main/docs/getting-started.md)
 * [Set up a12n-server](https://github.com/curveball/next-a12n/blob/main/README.md#setting-up-a12n-server)
 * - [How to add a new client to a12n-server](https://github.com/curveball/next-a12n/tree/main?tab=readme-ov-file#register-a-new-client-side-web-app-on-curveballa12n-server)
 * - [How to retrieve the user's information from your a12n-server](https://github.com/curveball/a12n-server/blob/main/docs/user-api.md)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 *
 * ### Notes
 *
 * Grant type: Authorization Code
 *
 * By default, Auth.js assumes that the a12n-server Oauth2 provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export interface A12nServerUserProfile
  extends Record<keyof Profile, Profile[keyof Profile]> {
  sub: string
  email?: string
  email_verified?: boolean
  name: string
  website?: string
  zoneinfo?: string
  given_name?: string
  family_name?: string
  preferred_username?: string
  phone_number?: string
  phone_number_verified?: boolean
  locale?: string
  updated_at: number
  picture?: string
  address?: string
  birthdate?: string
}

export default function a12n(
  config: OIDCConfig<A12nServerProfile>
): OIDCUserConfig<A12nServerUserProfile> {
  return {
    id: "a12n-server",
    name: "a12n-server",
    issuer: config.issuer,
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    checks: ["pkce", "state", "nonce"],
    profile(profile) {
      return {
        ...profile,
        updated_at: Date.now(),
      } satisfies A12nServerUserProfile
    },
  }
}
