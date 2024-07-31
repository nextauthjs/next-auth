import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

/** @todo Document this */
export default function ForwardEmail(config: EmailUserConfig): EmailConfig {
  return {
    id: "forwardemail",
    type: "email",
    name: "Forward Email",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      const res = await fetch("https://api.forwardemail.net/v1/emails", {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(provider.apiKey + ":")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: provider.from,
          to,
          subject: `Sign in to ${host}`,
          html: html({ url, host, theme }),
          text: text({ url, host }),
        }),
      })

      if (!res.ok)
        throw new Error(
          "Forward Email error: " + JSON.stringify(await res.json())
        )
    },
    options: config,
  }
}
