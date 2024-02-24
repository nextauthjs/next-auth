import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

/** @todo Document this */
export default function Resend(config: EmailUserConfig): EmailConfig {
  return {
    id: "resend",
    type: "email",
    name: "Resend",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
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
        throw new Error("Resend error: " + JSON.stringify(await res.json()))
    },
    options: config,
  }
}
