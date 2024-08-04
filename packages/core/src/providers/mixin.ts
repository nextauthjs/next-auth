/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Mixin</b> integration.
 * </span>
 * <a href="https://mixin.one" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/mixin.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/mixin
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"


/** @see [Get the authenticated user](https://developers.mixin.one/docs/api/users/profile). */
export interface MixinProfile {
    type: string
    user_id: string
    identity_number: string
    phone: string
    full_name: string
    biography: string
    avatar_url: string
    relationship: string
    mute_until: string
    created_at: string
    is_verified: boolean
    is_scam: boolean
    is_deactivated: boolean
    code_id: string
    code_url: string
    features: any
    has_safe: boolean
    session_id: string
    device_status: string
    has_pin: boolean
    receive_message_source: string
    accept_conversation_source: string
    accept_search_source: string
    fiat_currency: string
    transfer_notification_threshold: number
    transfer_confirmation_threshold: number
    pin_token_base64: string
    pin_token: string
    salt_base64: string
    tip_key_base64: string
    tip_counter: number
    spend_public_key: string
    has_emergency_contact: boolean
}



/**
 * Add Mixin login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/mixin
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import MixinProvider from "@auth/core/providers/mixin"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     MixinProvider({
 *       clientId: MIXIN_CLIENT_ID,
 *       clientSecret: MIXIN_CLIENT_SECRET
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Mixin - Use Mixin as an OAuth 2 Provider](https://developers.mixin.one/docs/dapp/getting-started/oauth)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Mixin provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Mixin provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/mixin.ts).
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

export default function Mixin(
  config: OAuthUserConfig<MixinProfile>
): OAuthConfig<MixinProfile> {
  return {
    id: "mixin",
    name: "Mixin",
    type: "oauth",
    authorization: {
      url: "https://mixin.one/oauth/authorize",
      params: {
        client_id: config.clientId,
        scope: "PROFILE:READ",
        response_type: "code",
      },
    },
    token: {
        url: "https://api.mixin.one/oauth/token",
        async request(context) {
          const response = await fetch("https://api.mixin.one/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              client_id: config.clientId,
              client_secret: config.clientSecret,
              code: context.params.code,
            }),
          }).then((resp) => resp.json());

          return {
            tokens: {
              access_token: response.data.access_token,
              scope: response.data.scope,
            },
          };
        },
      },
    userinfo: "https://api.mixin.one/me",
    profile(profile) {
      return {
        id: profile.data.user_id,
        name: profile.data.full_name,
        email: profile?.data.email || null,
        image: profile?.data.avatar_url,
      }
    },
    style: {
      bg: "#41a6f6",
      text: "#fff",
    },
    options: config,
  }
}
