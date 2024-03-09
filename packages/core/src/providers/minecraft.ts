/**
 * <div style={{backgroundColor: "#3b8526", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Minecraft</b> integration.</span>
 * <a href="https://www.minecraft.net">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/azure.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/azure-ad
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface MinecraftProfile extends Record<string, any> {
  id: string
  name: string
  email: string
}

/**
 * Add Minecraft login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/minecraft
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Minecraft from "@auth/core/providers/minecraft"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Minecraft({ clientId: AZURE_AD_CLIENT_ID, clientSecret: AZURE_AD_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Microsoft Authentication Scheme](https://wiki.vg/Microsoft_Authentication_Scheme)
 *  - [AzureAd OAuth documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow/)
 *  - [AzureAd OAuth apps](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app/)
 *
 * @example
 *
 * - In https://portal.azure.com/ search for "Azure Active Directory", and select your organization.
 * - Next, go to "App Registration" in the left menu, and create a new one.
 * - Pay close attention to "Who can use this application or access this API?"
 *   - This allows you to scope access to specific types of user accounts
 *   - Select "Personal Microsoft accounts only".
 * - When asked for a redirection URL, use `https://yourapplication.com/api/auth/callback/minecraft` or for development `http://localhost:3000/api/auth/callback/minecraft`.
 * - After your App Registration is created, under "Client Credential" create your Client secret.
 * - Now copy your:
 *   - Application (client) ID
 *   - Client secret (value)
 *
 * In `.env.local` create the following entries:
 *
 * ```
 * AZURE_AD_CLIENT_ID=<copy Application (client) ID here>
 * AZURE_AD_CLIENT_SECRET=<copy generated client secret value here>
 * ```
 *
 * That will default the tenant to use the `consumers` authorization endpoint. [For more details see here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-protocols#endpoints).
 *
 * :::note
 * Minecraft only supports the `consumers` tenant.
 * :::
 *
 * In `pages/api/auth/[...nextauth].js` find or add the `Minecraft` entries:
 *
 * ```js
 * import Minecraft from "next-auth/providers/minecraft";
 *
 * ...
 * providers: [
 *   Minecraft({
 *     clientId: process.env.AZURE_AD_CLIENT_ID,
 *     clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
 *   }),
 * ]
 * ...
 *
 * ```
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Minecraft provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Minecraft provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/minecraft.ts).
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
export default function Minecraft<P extends MinecraftProfile>(
  options: OAuthUserConfig<P> & {
    /** @default "consumers" */
    tenantId?: string
  }
): OAuthConfig<P> {
  const tenant = options.tenantId ?? "consumers"

  return {
    id: "minecraft",
    name: "Minecraft",
    type: "oauth",
    wellKnown: `https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`,
    authorization: {
      url: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
      params: {
        scope: "openid email XboxLive.signin",
      },
    },
    userinfo: {
      async request({ tokens }) {
        if (tokens.id_token) {
          const decoded = JSON.parse(
            Buffer.from(tokens.id_token.split(".")[1]!, "base64").toString()
          ) as { email: string }

          const xbox = await fetch(
            "https://user.auth.xboxlive.com/user/authenticate",
            {
              method: "POST",
              body: JSON.stringify({
                Properties: {
                  AuthMethod: "RPS",
                  SiteName: "user.auth.xboxlive.com",
                  RpsTicket: "d=" + tokens.access_token,
                },
                RelyingParty: "http://auth.xboxlive.com",
                TokenType: "JWT",
              }),
            }
          )

          if (xbox.ok) {
            const xboxResponse = (await xbox.json()) as {
              DisplayClaims: { xui: { uhs: string | undefined }[] }
              Token: string | undefined
            }

            const xboxToken = xboxResponse?.Token
            const userHash = xboxResponse?.DisplayClaims.xui[0]?.uhs

            if (userHash && xboxToken) {
              const xsts = await fetch(
                "https://xsts.auth.xboxlive.com/xsts/authorize",
                {
                  method: "POST",
                  body: JSON.stringify({
                    Properties: {
                      SandboxId: "RETAIL",
                      UserTokens: [xboxToken],
                    },
                    RelyingParty: "rp://api.minecraftservices.com/",
                    TokenType: "JWT",
                  }),
                }
              )

              if (xsts.ok) {
                const xstsResponse = (await xsts.json()) as {
                  Token: string | undefined
                }

                const xstsToken = xstsResponse?.Token

                if (xstsToken) {
                  const minecraft = await fetch(
                    "https://api.minecraftservices.com/authentication/login_with_xbox",
                    {
                      method: "POST",
                      body: JSON.stringify({
                        identityToken: "XBL3.0 x=" + userHash + ";" + xstsToken,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  )

                  if (minecraft.ok) {
                    const minecraftResponse = (await minecraft.json()) as {
                      access_token: string | undefined
                    }

                    const access_token = minecraftResponse.access_token

                    if (access_token) {
                      const minecraftProfile = await fetch(
                        "https://api.minecraftservices.com/minecraft/profile",
                        {
                          headers: {
                            Authorization: `Bearer ${access_token}`,
                          },
                        }
                      )

                      if (minecraftProfile.ok) {
                        const minecraftProfileResponse =
                          (await minecraftProfile.json()) as {
                            id: string
                            name: string
                          }

                        console.log(minecraftProfileResponse.name)

                        return {
                          id: minecraftProfileResponse.id,
                          name: minecraftProfileResponse.name,
                          email: decoded.email,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }

        throw new Error()
      },
    },
    async profile(profile) {
      return profile
    },
    style: { logo: "/microsoft.svg", text: "#fff", bg: "#3b8526" },
    options,
  }
}
