/**
 * <div style={{backgroundColor: "#111", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Kobble</b> integration.</span>
 * <a href="https://kobble.io">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/kobble.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/kobble
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"


export interface KobbleProfile {
  sub: string;
  id: string;
  email: string | null;
  name: string | null;
  picture_url: string | null;
  is_verified: boolean;
  products: Array<{
    id: string;
    name: string;
    quotas: Array<{
      id: string;
      name: string;
      limit: number;
    }>;
  }>;
  stripe_id: string | null;
  updated_at: string;
  created_at: string;
}


/**
 * Add Kobble login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 *
 * Authorize this callback URL in your [Kobble application settings](https://kobble.io).
 *
 * ```
 * https://example.com/api/auth/callback/kobble
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Kobble from "@auth/core/providers/kobble"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Kobble({ clientId: KOBBLE_CLIENT_ID, clientSecret: KOBBLE_CLIENT_SECRET, tenant: KOBBLE_TENANT })],
 * })
 * ```
 *
 * :::tip
 * The `tenant` option corresponds to your customer portal domain.
 * :::
 *
 * ### Resources
 *
 *  - [Kobble OAuth documentation](https://docs.kobble.io/product/authentication/overview)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Kobble provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 * Enable the `openid` option in scope if you want to save the users email address on sign up.
 * :::
 *
 * :::tip
 *
 * The Kobble provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/kobble.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
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
 */export default function Kobble<P extends KobbleProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * This corresponds to your customer portal domain.
     */
    tenant: string
  }
): OAuthConfig<P> {
  return {
    id: "kobble",
    name: "Kobble",
    type: "oauth",
    authorization: `${options.tenant}/oauth/authorize?scope=read_user`,
    token: `${options.tenant}/api/oauth/token`,
    userinfo: `${options.tenant}/api/oauth/userinfo`,
    checks: ["state"],
    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.picture_url,
      }
    },
    style: { logo: "/kobble.svg", bg: "#111", text: "#fff" },
    ...options,
  }
}