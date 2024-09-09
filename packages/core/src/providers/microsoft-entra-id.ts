/**
 * <div style={{backgroundColor: "#0072c6", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Microsoft Entra ID</b> integration.</span>
 * <a href="https://learn.microsoft.com/en-us/entra/identity">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/microsoft-entra-id.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/microsoft-entra-id
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface MicrosoftEntraIDProfile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

export type MicrosoftEntraIDOptions<P extends MicrosoftEntraIDProfile> =
  OAuthUserConfig<P> & {
    /**
     * https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples
     *
     * @default 48
     */
    profilePhotoSize?: 48 | 64 | 96 | 120 | 240 | 360 | 432 | 504 | 648
    /** @default "common" */
    tenantId?: string
  }

/**
 *
 * Add Microsoft Entra ID login to your page.
 *
 * :::note
 * Entra is the [new name](https://learn.microsoft.com/en-us/entra/fundamentals/new-name) Microsoft has given to what was previously known as "Azure AD"
 * :::
 *
 * ## Setup
 *
 * ### Callback URL
 * ```
 * https://example.com/api/auth/callback/microsoft-entra-id
 * ```
 *
 * ### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     MicrosoftEntraID({
 *       clientId: AUTH_MICROSOFT_ENTRA_ID_ID,
 *       clientSecret: AUTH_MICROSOFT_ENTRA_ID_SECRET,
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Microsoft Entra OAuth documentation](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow)
 *  - [Microsoft Entra OAuth apps](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
 *
 * @example
 *
 * ### To allow specific Active Directory users access:
 *
 * - In https://entra.microsoft.com/ select Identity from the left bar menu.
 * - Next, go to "App Registration" in the left menu, and create a new one.
 * - Pay close attention to "Who can use this application or access this API?"
 *   - This allows you to scope access to specific types of user accounts
 *   - Only your tenant, all Microsoft tenants, or all Microsoft tenants and public Microsoft accounts (Skype, Xbox, Outlook.com, etc.)
 * - When asked for a redirection URL, use `https://yourapplication.com/api/auth/callback/microsoft-entra-id` or for development `http://localhost:3000/api/auth/callback/microsoft-entra-id`.
 * - After your App Registration is created, under "Client Credential" create your Client secret.
 * - Now copy your:
 *   - Application (client) ID
 *   - Directory (tenant) ID
 *   - Client secret (value)
 *
 * In `.env.local` create the following entries:
 *
 * ```
 * AUTH_MICROSOFT_ENTRA_ID_ID=<copy Application (client) ID here>
 * AUTH_MICROSOFT_ENTRA_ID_SECRET=<copy generated client secret value here>
 * AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=<copy the tenant id here>
 * ```
 *
 * That will default the tenant to use the `common` authorization endpoint. [For more details see here](https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols#endpoints).
 *
 * :::note
 * Microsoft Entra returns the profile picture in an ArrayBuffer, instead of just a URL to the image, so our provider converts it to a base64 encoded image string and returns that instead. See: https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples. The default image size is 48x48 to avoid [running out of space](https://next-auth.js.org/faq#:~:text=What%20are%20the%20disadvantages%20of%20JSON%20Web%20Tokens%3F) in case the session is saved as a JWT.
 * :::
 *
 * In `auth.ts` find or add the `Entra` entries:
 *
 * ```ts
 * import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id"
 *
 * providers: [
 *   MicrosoftEntraID({
 *     clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
 *     clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
 *     tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
 *   }),
 * ]
 * ```
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the MicrosoftEntra provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Microsoft Entra ID provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/microsoft-entra-id.ts).
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
export default function MicrosoftEntraID<P extends MicrosoftEntraIDProfile>(
  options: MicrosoftEntraIDOptions<P>
): OAuthConfig<P> {
  const { tenantId = "common", profilePhotoSize = 48, ...rest } = options
  rest.issuer ??= `https://login.microsoftonline.com/${tenantId}/v2.0`
  return {
    id: "microsoft-entra-id",
    name: "Microsoft Entra ID",
    type: "oidc",
    wellKnown: `${rest.issuer}/.well-known/openid-configuration?appid=${options.clientId}`,
    authorization: {
      params: {
        scope: "openid profile email User.Read",
      },
    },
    async profile(profile, tokens) {
      // https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0&tabs=http#examples
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
    style: { text: "#fff", bg: "#0072c6" },
    options: rest,
  }
}
