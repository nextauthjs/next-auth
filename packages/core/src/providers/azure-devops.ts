import { OAuthConfig, OAuthUserConfig } from "./index.js"

/** @see [Azure DevOps Services REST API 7.0 · Profiles · Get](https://learn.microsoft.com/en-us/rest/api/azure/devops/profile/profiles/get?view=azure-devops-rest-7.0&tabs=HTTP#examples) */
export interface AzureDevOpsProfile extends Record<string, any> {
  id: string
  displayName: string
  emailAddress: string
  coreAttributes: { Avatar: { value: { value: string } } }
}

/**
 *
 * @deprecated
 * While still available, Microsoft is [no longer supporting](https://learn.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops#available-oauth-models) Azure DevOps OAuth and recommends using [Microsoft Entra ID](/getting-started/providers/microsoft-entra-id) instead.
 *
 * ## Documentation
 *
 * [Microsoft Docs](https://docs.microsoft.com/en-us) · [Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/) · [Authorize access to REST APIs with OAuth 2.0](https://docs.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops])
 *
 * ## Configuration
 *
 * ### Register application
 *
 * :::tip
 * [`https://app.vsaex.visualstudio.com/app/register`](https://app.vsaex.visualstudio.com/app/register)
 * :::
 *
 * Provide the required details:
 *
 * - Company name
 * - Application name
 * - Application website
 * - Authorization callback URL
 *   - `https://example.com/api/auth/callback/azure-devops` for production
 *   - `https://localhost/api/auth/callback/azure-devops` for development
 * - Authorized scopes
 *   - Required minimum is `User profile (read)`
 *
 * Click ‘Create Application’
 *
 * :::warning
 * You are required to use HTTPS even for the localhost
 * :::
 *
 * :::warning
 * You will have to delete and create a new application to change the scopes later
 * :::
 *
 * The following data is relevant for the next step:
 *
 * - App ID
 * - Client Secret (after clicking the ‘Show’ button, ignore App Secret entry above it)
 * - Authorized Scopes
 *
 * ### Set up the environment variables
 *
 * In `.env.local` create the following entries:
 *
 * ```
 * AZURE_DEVOPS_APP_ID=<copy App ID value here>
 * AZURE_DEVOPS_CLIENT_SECRET=<copy generated client secret value here>
 * AZURE_DEVOPS_SCOPE=<copy space separated Authorized Scopes list here>
 * ```
 *
 * ## Example
 *
 * ```ts
 * import AzureDevOps from "@auth/core/providers/azure-devops"
 * ...
 * providers: [
 *   AzureDevOps({
 *     clientId: process.env.AZURE_DEVOPS_APP_ID,
 *     clientSecret: process.env.AZURE_DEVOPS_CLIENT_SECRET,
 *     scope: process.env.AZURE_DEVOPS_SCOPE,
 *   }),
 * ]
 * ...
 * ```
 *
 * ### Refresh token rotation
 *
 * Use the [main guide](/guides/basics/refresh-token-rotation) as your starting point with the following considerations:
 *
 * ```ts
 * async jwt({ token, user, account }) {
 *   ...
 *   // The token has an absolute expiration time
 *   const accessTokenExpires = account.expires_at * 1000
 *   ...
 * }
 *
 * async function refreshAccessToken(token) {
 *   ...
 *   const response = await fetch(
 *     "https://app.vssps.visualstudio.com/oauth2/token",
 *     {
 *       headers: { "Content-Type": "application/x-www-form-urlencoded" },
 *       method: "POST",
 *       body: new URLSearchParams({
 *         client_assertion_type:
 *           "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
 *         client_assertion: process.env.AZURE_DEVOPS_CLIENT_SECRET,
 *         grant_type: "refresh_token",
 *         assertion: token.refreshToken,
 *         redirect_uri:
 *           process.env.NEXTAUTH_URL + "/api/auth/callback/azure-devops",
 *       }),
 *     }
 *   )
 *   ...
 *   // The refreshed token comes with a relative expiration time
 *   const accessTokenExpires = Date.now() + newToken.expires_in * 1000
 *   ...
 * }
 * ```
 */
export default function AzureDevOpsProvider<P extends AzureDevOpsProfile>(
  options: OAuthUserConfig<P> & {
    /**
     * https://docs.microsoft.com/en-us/azure/devops/integrate/get-started/authentication/oauth?view=azure-devops#scopes
     * @default vso.profile
     */
    scope?: string
  }
): OAuthConfig<P> {
  const scope = options.scope ?? "vso.profile"
  const tokenEndpointUrl = "https://app.vssps.visualstudio.com/oauth2/authorize"
  const userInfoEndpointUrl =
    "https://app.vssps.visualstudio.com/_apis/profile/profiles/me?details=true&coreAttributes=Avatar&api-version=6.0"

  return {
    id: "azure-devops",
    name: "Azure DevOps",
    type: "oauth",

    authorization: {
      url: "https://app.vssps.visualstudio.com/oauth2/authorize",
      params: { response_type: "Assertion", scope },
    },

    token: {
      url: tokenEndpointUrl,
      async request(context) {
        const response = await fetch(tokenEndpointUrl, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          method: "POST",
          body: new URLSearchParams({
            client_assertion_type:
              "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            client_assertion: context.provider.clientSecret as string,
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: context.params.code as string,
            redirect_uri: context.provider.callbackUrl,
          }),
        })
        return { tokens: await response.json() }
      },
    },

    userinfo: {
      url: userInfoEndpointUrl,
      async request(context) {
        const accessToken = context.tokens.access_token as string
        const response = await fetch(userInfoEndpointUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        return response.json()
      },
    },

    profile(profile) {
      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.emailAddress,
        image: `data:image/jpeg;base64,${profile.coreAttributes.Avatar.value.value}`,
      }
    },

    options,
  }
}
