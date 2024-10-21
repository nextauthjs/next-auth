/**
 * <div style={{backgroundColor: "#fff", display: "flex", justifyContent: "space-between", color: "#3448c5", padding: 16}}>
 * <span>Built-in <b>Cloudinary</b> integration.</span>
 * <a href="https://cloudinary.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/cloudinary.svg" width="48" height="48" />
 * </a>
 * </div>
 *
 * @module providers/cloudinary
 */
import { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface CloudinaryProfile {
  sub: string
}

/**
 * Add Cloudinary login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/cloudinary
 * ```
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Cloudinary from "@auth/core/providers/cloudinary"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Cloudinary({
 *       clientId: CLOUDINARY_CLIENT_ID,
 *       clientSecret: CLOUDINARY_CLIENT_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 * - [Cloudinary OAuth documentation](https://cloudinary.com/documentation/using_oauth_to_access_cloudinary_apis)
 *
 * ### Notes
 * - If the OAuth token is used against the Admin/Upload API, the user must be assigned a Master Admin role within the product environment
 * - If you'd like to get more information about the user – you can use the [Cloudinary Account Provisioning API](https://cloudinary.com/documentation/provisioning_api)
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Cloudinary<P extends CloudinaryProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "cloudinary",
    name: "Cloudinary",
    type: "oauth",
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    wellKnown: "https://oauth.cloudinary.com/.well-known/openid-configuration",
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.sub,
      }
    },
    style: { bg: "#fff", text: "#3448c5" },
  }
}
