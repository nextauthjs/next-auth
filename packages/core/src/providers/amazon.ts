/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Amazon</b> integration.</span>
 * <a href="https://amazon.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/amazon.svg" height="48" width="48"/>
 * </a>
 * </div>
 * @module providers/amazon
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface AmazonProfile extends Record<string, any> {
  email: string
  name: string
  user_id: string
  postal_code?: string
}

/**
 * Add "Login with Amazon" login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/auth/callback/amazon
 * ```
 *
 * For Express.js or Next.js Pages Router, use:
 * ```
 * https://example.com/api/auth/callback/amazon
 * ```
 *
 * ### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Amazon from "@auth/core/providers/amazon"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Amazon({
 *       clientId: AUTH_AMAZON_ID,
 *       clientSecret: AUTH_AMAZON_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 * - [Login with Amazon documentation](https://developer.amazon.com/docs/login-with-amazon/documentation-overview.html)
 *
 * ### Bug reports
 * If you encounter issues with this provider, please check the Auth.js documentation and open an issue in the Auth.js repository with details about your configuration and error.
 *
 * ### Customization
 * If you need to override this provider's defaults, follow the Auth.js guide on customizing built-in OAuth providers.
 */
export default function Amazon<P extends AmazonProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "amazon",
    name: "Amazon",
    type: "oauth",
    authorization: {
      // https://developer.amazon.com/docs/login-with-amazon/authorization-code-grant.html
      url: "https://www.amazon.com/ap/oa",
      params: {
        scope: "profile",
      },
    },
    // https://developer.amazon.com/docs/login-with-amazon/authorization-code-grant.html#access-token-request
    token: "https://api.amazon.com/auth/o2/token",
    // https://developer.amazon.com/docs/login-with-amazon/obtain-customer-profile.html
    userinfo: "https://api.amazon.com/user/profile",
    profile(profile: P) {
      // https://developer.amazon.com/docs/login-with-amazon/customer-profile.html
      return {
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    style: { brandColor: "#ff9900" },
    options,
  }
}
