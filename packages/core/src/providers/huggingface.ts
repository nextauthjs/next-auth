/**
 * <div class="provider" style={{backgroundColor: "#fff", display: "flex", justifyContent: "space-between", color: "#000", padding: 16}}>
 * <span>Built-in <b>Hugging Face</b> integration.</span>
 * <a href="https://huggingface.co">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/huggingface.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/huggingface
 */

import type { OIDCConfig, OIDCUserConfig } from "./index.js"

export interface HuggingfaceProfile {
  /**
   * Unique identifier for the user.
   */
  sub: string
  /**
   * Full name of the user.
   *
   * Needs 'profile' scope
   */
  name?: string
  /**
   * Username of the user.
   *
   * Need 'profile' scope
   */
  preferred_username?: string
  /**
   * URL of the user's avatar.
   *
   * Need 'profile' scope
   */
  profile?: string
  /**
   * URL of the user's profile picture.
   *
   * Need 'profile' scope
   */
  picture?: string
  /**
   * Need 'profile' scope
   *
   * Website of the user.
   */
  website?: string
  /**
   * Need 'email' scope
   *
   * Email address of the user.
   */
  email?: string
  /**
   * Need 'email' scope
   *
   * Whether the user's email address is verified. Should always be true, Hugging Face enforces
   * email verification for users to grant access to OAuth apps.
   */
  email_verified?: boolean
  /**
   * Whether the user has a paid subscription.
   */
  isPro: boolean
  /**
   * Whether the user has a payment method set up.
   *
   * Needs the `read-billing` scope.
   */
  canPay?: boolean
  /**
   * List of the user's organizations.
   */
  orgs: Array<{
    /**
     * Unique identifier for the organization.
     */
    sub: string
    /**
     * Name of the organization.
     */
    name: string
    /**
     * URL of the organization's avatar.
     */
    picture: string
    /**
     * Username of the organization.
     */
    preferred_username: string
    /**
     * Whether the organization has a paid enterprise subscription.
     */
    isEnterprise: boolean
    /**
     * Whether the organization has a payment method set up.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    canPay?: boolean
    /**
     * The role of the user in the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    roleInOrg?: "admin" | "write" | "read" | "contributor"
    /**
     * User needs to re-authenticate to access the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    pendingSSO?: boolean
    /**
     * User needs to enable MFA to access the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    missingMFA?: boolean
    /**
     * Resource groups are a feature of enterprise organizations.
     *
     * They allow granular access control to resources within the organization.
     *
     * Access to the organization needs to be granted to the oauth app for this field to be present.
     */
    resourceGroups?: Array<{
      /**
       * Unique identifier for the resource group.
       */
      sub: string
      name: string
      /**
       * The role of the user in the resource group.
       */
      role: "read" | "write" | "admin" | "contributor"
    }>
  }>
}

/**
 * Add HuggingFace login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/huggingface
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import HuggingFace from "@auth/core/providers/huggingface"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     HuggingFace({
 *       clientId: HUGGINGFACE_CLIENT_ID,
 *       clientSecret: HUGGINGFACE_CLIENT_SECRET,
 *       authorization: {
 *        params: {
 *          scope: "openid profile email", // specify the scopes you need
 *          //  orgIds: "unique_org_id" // If your oauth app needs access to a specific organization of the user
 *        }
 *       },
 *     }),
 *   ],
 * })
 * ```
 *
 * The following scopes are available:
 *
 * - `openid`: Grants access to the user's OpenID Connect profile.
 * - `profile`: Grants access to the user's profile information.
 * - `email`: Grants access to the user's email address.
 * - `read-repos`: Grants read access to the user's repositories.
 * - `write-repos`: Grants write access to the user's repositories.
 * - `manage-repos`: Can create/delete repositories on behalf of the user.
 * - `write-discussions`: Can post on the user's behalf.
 * - `read-billing`: Know if the user has a payment method set up.
 * - `inference-api`: Can make calls to Inference providers on behalf of the user.
 * - `webhooks`: Can manage webhooks on behalf of the user.
 *
 * You need to enable them first in your OAuth app settings.
 *
 * /!\ By default, the `profile` and `email` scopes are enabled in NextAuth. So you need to enable
 * the `email` scope in your OAuth app settings or you will get a scope error.
 *
 * ### Resources
 *
 *  - [Hugging Face OAuth documentation](https://huggingface.co/docs/hub/en/oauth#creating-an-oauth-app)
 *  - [Create an OAuth application](https://huggingface.co/settings/applications/new)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Hugging Face provider is
 * based on the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *
 * :::tip
 *
 * The HuggingFace provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/huggingface.ts).
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
export default function Huggingface(
  options: OIDCUserConfig<HuggingfaceProfile>
): OIDCConfig<HuggingfaceProfile> {
  return {
    id: "huggingface",
    name: "Hugging Face",
    type: "oidc",
    issuer: "https://huggingface.co",
    checks: ["state", "pkce"],

    style: {
      bg: "#FFD21E",
      text: "#000",
    },
    options,
  }
}
