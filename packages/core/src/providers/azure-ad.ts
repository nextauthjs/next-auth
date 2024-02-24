/**
 * <div style={{backgroundColor: "#0072c6", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Azure AD</b> integration.</span>
 * <a href="https://learn.microsoft.com/en-us/azure/active-directory">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/azure.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/azure-ad
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface AzureADProfile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

/**
 * Add AzureAd login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/azure-ad
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import AzureAd from "@auth/core/providers/azure-ad"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [AzureAd({ clientId: AZURE_AD_CLIENT_ID, clientSecret: AZURE_AD_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [AzureAd OAuth documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow/)
 *  - [AzureAd OAuth apps](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app/)
 *
 * @example
 *
 * ### To allow specific Active Directory users access:
 *
 * - In https://portal.azure.com/ search for "Azure Active Directory", and select your organization.
 * - Next, go to "App Registration" in the left menu, and create a new one.
 * - Pay close attention to "Who can use this application or access this API?"
 *   - This allows you to scope access to specific types of user accounts
 *   - Only your tenant, all azure tenants, or all azure tenants and public Microsoft accounts (Skype, Xbox, Outlook.com, etc.)
 * - When asked for a redirection URL, use `https://yourapplication.com/api/auth/callback/azure-ad` or for development `http://localhost:3000/api/auth/callback/azure-ad`.
 * - After your App Registration is created, under "Client Credential" create your Client secret.
 * - Now copy your:
 *   - Application (client) ID
 *   - Directory (tenant) ID
 *   - Client secret (value)
 *
 * In `.env.local` create the following entries:
 *
 * ```
 * AZURE_AD_CLIENT_ID=<copy Application (client) ID here>
 * AZURE_AD_CLIENT_SECRET=<copy generated client secret value here>
 * AZURE_AD_TENANT_ID=<copy the tenant id here>
 * ```
 *
 * That will default the tenant to use the `common` authorization endpoint. [For more details see here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols#endpoints).
 *
 * :::note
 * Azure AD returns the profile picture in an ArrayBuffer, instead of just a URL to the image, so our provider converts it to a base64 encoded image string and returns that instead. See: https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples. The default image size is 48x48 to avoid [running out of space](https://next-auth.js.org/faq#:~:text=What%20are%20the%20disadvantages%20of%20JSON%20Web%20Tokens%3F) in case the session is saved as a JWT.
 * :::
 *
 * In `pages/api/auth/[...nextauth].js` find or add the `AzureAD` entries:
 *
 * ```js
 * import AzureADProvider from "next-auth/providers/azure-ad";
 *
 * ...
 * providers: [
 *   AzureADProvider({
 *     clientId: process.env.AZURE_AD_CLIENT_ID,
 *     clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
 *     tenantId: process.env.AZURE_AD_TENANT_ID,
 *   }),
 * ]
 * ...
 *
 * ```
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the AzureAd provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The AzureAd provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/azure-ad.ts).
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
export default function AzureAD<P extends AzureADProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
     *
     * @default 48
     */
    profilePhotoSize?: 48 | 64 | 96 | 120 | 240 | 360 | 432 | 504 | 648
    /** @default "common" */
    tenantId?: string
  }
): OAuthConfig<P> {
  const { tenantId = "common", profilePhotoSize = 48, ...rest } = options
  rest.issuer ??= `https://login.microsoftonline.com/${tenantId}/v2.0`
  return {
    id: "azure-ad",
    name: "Azure Active Directory",
    type: "oidc",
    wellKnown: `${rest.issuer}/.well-known/openid-configuration?appid=${options.clientId}`,
    authorization: {
      params: {
        scope: "openid profile email User.Read",
      },
    },
    async profile(profile, tokens) {
      // https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`,
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      )

      // Confirm that profile photo was returned
      let image
      // TODO: Do this without Buffer
      if (response.ok && typeof Buffer !== "undefined") {
        try {
          const pictureBuffer = await response.arrayBuffer()
          const pictureBase64 = Buffer.from(pictureBuffer).toString("base64")
          image = `data:image/jpeg;base64, ${pictureBase64}`
        } catch {}
      }

      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: image ?? null,
      }
    },
    style: { logo: "/azure.svg", text: "#fff", bg: "#0072c6" },
    options: rest,
  }
}
