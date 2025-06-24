/**
 * <div class="provider" style={{display: "flex", justifyContent: "space-between"}}>
 * <div>
 *  <span>
 *    The NotificationAPI provider helps you send magic links through email from Auth.js.<br />
 *  </span>
 * </div>
 * <a href="https://www.notificationapi.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/notificationapi.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/notificationapi
 */

import type { EmailConfig } from "./index.js"

/**
 *
 * ### Setup
 *
 * #### Configuration
 *```ts
 * NextAuth({
 * ...
 * providers: [
 *   NotificationAPI({
 *     notificationId: 'auth_magic_link' // from dashboard
 *   })
 * ]
 * ...
 * })
 * ```
 *
 * ### Resources
 *
 *  - [NotificationAPI Documentation](https://docs.notificationapi.com)
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

export type NotificationAPIUserConfig = {
  notificationId: string
  apiKey?: string
  baseURL?: string
}

export interface NotificationAPIConfig
  extends Omit<
    EmailConfig,
    "sendVerificationRequest" | "options" | "apiKey" | "from"
  > {
  id: string
  apiKey?: string
  notificationId?: string
  baseURL: string
  sendVerificationRequest: (params: Params) => Promise<void>
}

type Params = Parameters<EmailConfig["sendVerificationRequest"]>[0] & {
  provider: NotificationAPIConfig
}

export default function NotificationAPI(
  config: NotificationAPIUserConfig
): NotificationAPIConfig {
  return {
    id: "notificationapi",
    type: "email",
    name: "NotificationAPI",
    notificationId: config.notificationId,
    baseURL: config.baseURL || "https://api.notificationapi.com",
    apiKey: config.apiKey || process.env.NOTIFICATIONAPI_API_KEY,
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params: Params) {
      const { identifier, provider, url, token } = params
      const { apiKey, notificationId, baseURL } = provider

      if (!apiKey) {
        throw new Error(
          "Missing NOTIFICATIONAPI_API_KEY. Please add to .env file or pass as `apiKey` in the provider configuration."
        )
      }

      const [clientId, clientSecret] = atob(apiKey).split(":")
      const res = await fetch(`${baseURL}/${clientId}/sender`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          "Content-Type": "application/json",
          "User-Agent": "Auth.js/v0.38.0",
          Accept: "application/json",
        },
        body: JSON.stringify({
          notificationId: notificationId,
          user: {
            id: identifier,
            email: identifier,
          },
          mergeTags: {
            url,
            token,
          },
        }),
      })

      if (!res.ok)
        throw new Error(
          "NotificationAPI Error: " + JSON.stringify(await res.json())
        )
    },
  }
}
