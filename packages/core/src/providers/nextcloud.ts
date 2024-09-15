/**
 * <div style={{backgroundColor: "#0082C9", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Nextcloud</b> integration.</span>
 * <a href="https://nextcloud.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/nextcloud-dark.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/nextcloud
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Represents the Nextcloud user profile data returned from the `/ocs/v1.php/cloud/users/`.
 * @see [Check out the documentation for more details](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/instruction_set_for_users.html#get-data-of-a-single-user)
 */
export interface NextcloudProfile extends Record<string, any> {
  /**
   * The user's username.
   * @example "frank"
   */
  id: string

  /**
   * The email address associated with the user.
   * @example "frank@domain.tld"
   */
  email: string | null

  /**
   * The display name of the user.
   * @example "Frank K."
   */
  displayname: string

  /**
   * The phone number of the user.
   */
  phone: string

  /**
   * The address of the user.
   * @example "Foobar 12, 12345 Town"
   */
  address: string

  /**
   * The website URL of the user.
   * @example "https://nextcloud.com"
   */
  website: string

  /**
   * The user's Twitter handle.
   * @example "Nextcloud"
   */
  twitter: string

  /**
   * The user's Fediverse handle.
   */
  fediverse: string

  /**
   * The organization associated with the user.
   */
  organisation: string

  /**
   * The role or position of the user.
   */
  role: string

  /**
   * The headline or brief description of the user.
   */
  headline: string

  /**
   * The biography or detailed description of the user.
   */
  biography: string

  /**
   * An array of group names that the user belongs to.
   * @example ["admin", "group1", "group2"]
   */
  groups: string[]

  /**
   * The language preference of the user.
   * @example "en"
   */
  language: string

  /**
   * The locale or language locale of the user.
   * @example "en_US"
   */
  locale: string

  /**
   * Indicates whether the user account is enabled or disabled.
   * @example true
   */
  enabled: boolean

  /**
   * The storage location of the user's files.
   * @example "/path/to/nextcloud/data/frank"
   */
  storageLocation: string
}

/**
 * Add Nextcloud login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/nextcloud
 * ```
 *
 * #### Configuration
 *
 * ```ts
 * import { Auth } from "@auth/core"
 * import Nextcloud from "@auth/core/providers/nextcloud"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Nextcloud({ clientId: process.env.NEXTCLOUD_CLIENT_ID, clientSecret: process.env.NEXTCLOUD_CLIENT_SECRET, issuer: process.env.NEXTCLOUD_ISSUER })],
 * })
 * ```
 *
 * ### Configuring Nextcloud
 *
 * Follow these steps:
 *
 * - Login to your Nextcloud instance as an administrator.
 * - Head over to your Administrator Security Settings.
 *   - Click on your profile picture in the top right corner and select **Administration settings** from the dropdown menu.
 *   - On left sidebar, scroll down and click on **Security**.
 * - Under **OAuth 2.0 clients**, enter the name of your application and provide a redirection URL.
 *   - For the redirection URL, use `https://yourapplication.com/api/auth/callback/nextcloud` or `http://localhost:3000/api/auth/callback/nextcloud` for development.
 * - Click on **Add**. You should now have a Client Identifier and Secret.
 *
 * In `.env.local` create the following entries:
 *
 * ```
 * NEXTCLOUD_CLIENT_ID="Your client identifier"
 * NEXTCLOUD_CLIENT_SECRET="Your client secret"
 * NEXTCLOUD_ISSUER=https://your-nextcloud-instance.com
 * ```
 *
 * ### Resources
 *
 * - [Nextcloud Documentation](https://docs.nextcloud.com/)
 * - [Nextcloud OAuth 2](https://docs.nextcloud.com/server/latest/admin_manual/configuration_server/oauth2.html)
 * - [Nextcloud Clients and Client APIs](https://docs.nextcloud.com/server/latest/developer_manual/client_apis/index.html)
 * - [Nextcloud User provisioning API](https://docs.nextcloud.com/server/latest/admin_manual/configuration_user/user_provisioning_api.html)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Nextcloud provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::danger
 *
 * Nextcloud OAuth 2 implementation currently does not support scoped access.
 * This means that every token has full access to the complete account including read and write permission to the stored files.
 * It is essential to store the OAuth 2 tokens in a safe way!
 *
 * :::
 *
 * :::tip
 *
 * Some Nextcloud API endpoints return XML instead of JSON. To make the API return JSON, add the `Accept: application/json` header to the request.
 * Some endpoints also require the `OCS-APIRequest: true` header.
 *
 * :::
 *
 * :::tip
 *
 * The Nextcloud provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/nextcloud.ts).
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
 */
export default function Nextcloud(
  options: OAuthUserConfig<NextcloudProfile>
): OAuthConfig<NextcloudProfile> {
  return {
    id: "nextcloud",
    name: "Nextcloud",
    type: "oauth",
    authorization: `${options.issuer}/apps/oauth2/authorize`,
    token: `${options.issuer}/apps/oauth2/api/v1/token`,
    userinfo: {
      url: `${options.issuer}/ocs/v1.php/cloud/users`,
      async request({ tokens, provider }) {
        const url = `${provider.userinfo?.url}/${tokens.user_id}`

        const res = await fetch(url, {
          headers: {
            "OCS-APIRequest": "true",
            Authorization: `Bearer ${tokens.access_token}`,
            Accept: "application/json",
          },
        }).then((res) => res.json())
        return res.ocs.data
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.displayname,
        email: profile.email,
        image: `${options.issuer}/avatar/${profile.id}/512`,
      }
    },
    style: {
      logo: "/nextcloud.svg",
      bg: "#fff",
      text: "#0082C9",
    },
    options,
  }
}
