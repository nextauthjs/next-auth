import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

/**
 * Send magic links with [Pulsenote](https://pulsenote.eu), an email API with EU data
 * residency.
 *
 * ### Setup
 *
 * ```ts
 * import { Auth } from "@auth/core"
 * import Pulsenote from "@auth/core/providers/pulsenote"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Pulsenote({
 *       apiKey: AUTH_PULSENOTE_KEY,
 *       from: "login@example.com",
 *     }),
 *   ],
 * })
 * ```
 *
 * ### Notes
 *
 * Pulsenote sends only from a domain you have verified, so `from` must be an address
 * on one of them — there is no shared sending address.
 *
 * Until a domain is verified the API accepts a message and renders it, but does
 * **not** deliver it. This provider throws in that case rather than resolving: left
 * unchecked, sign-in would report success while the user waits for a link that was
 * never sent.
 *
 * ### Resources
 *
 * - [Pulsenote API documentation](https://pulsenote.eu/docs)
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can
 * [open an issue](https://authjs.dev/new/provider-issue).
 *
 * :::
 */
export default function Pulsenote(config: EmailUserConfig): EmailConfig {
  return {
    id: "pulsenote",
    type: "email",
    name: "Pulsenote",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      const res = await fetch(
        "https://api.pulsenote.eu/api/v1/notifications/send",
        {
          method: "POST",
          headers: {
            "X-API-Key": provider.apiKey as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to,
            subject: `Sign in to ${host}`,
            html: html({ url, host, theme }),
            text: text({ url, host }),
          }),
        }
      )

      if (!res.ok)
        throw new Error("Pulsenote error: " + JSON.stringify(await res.json()))

      // Pulsenote accepts and renders the message without delivering it when the
      // account has no verified sending domain. Left unchecked, sign-in reports
      // success and the user waits for a link that was never sent.
      const body = (await res.json()) as { sandbox?: boolean }
      if (body.sandbox)
        throw new Error(
          "Pulsenote error: the sign-in link was rendered but not delivered, " +
            "because the account has no verified sending domain."
        )
    },
    options: config,
  }
}
