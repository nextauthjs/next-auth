import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

/** @todo Document this */
export default function Mailersend(config: EmailUserConfig): EmailConfig {
  return {
    id: "mailersend",
    type: "email",
    name: "Mailersend",
    from: "no-reply@authjs.dev",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      const res = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: { email: provider.from },
          to: [{ email: to }],
          subject: `Sign in to ${host}`,
          html: html({ url, host, theme }),
          text: text({ url, host }),
        }),
      })
      if (!res.ok) throw new Error("Mailersend error: " + (await res.text()))
    },
    options: config,
  }
}
