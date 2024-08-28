import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

/** @todo Document this */
export default function SendGrid(config: EmailUserConfig): EmailConfig {
  return {
    id: "sendgrid",
    type: "email",
    name: "SendGrid",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: provider.from },
          subject: `Sign in to ${host}`,
          content: [
            { type: "text/plain", value: text({ url, host }) },
            { type: "text/html", value: html({ url, host, theme }) },
          ],
        }),
      })
      // REVIEW: Clean up error handling
      if (!res.ok) throw new Error("Sendgrid error: " + (await res.text()))
    },
    options: config,
  }
}
