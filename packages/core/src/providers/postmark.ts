import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

/** @todo Document this */
export default function Postmark(config: EmailUserConfig): EmailConfig {
  return {
    id: "postmark",
    type: "email",
    name: "Postmark",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      if (!provider.apiKey) throw new TypeError("Missing Postmark API Key")
      const res = await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": provider.apiKey,
        },
        body: JSON.stringify({
          From: provider.from,
          To: to,
          Subject: `Sign in to ${host}`,
          TextBody: text({ url, host }),
          HtmlBody: html({ url, host, theme }),
          MessageStream: "outbound",
        }),
      })

      if (!res.ok)
        throw new Error("Postmark error: " + JSON.stringify(await res.json()))
    },
    options: config,
  }
}
