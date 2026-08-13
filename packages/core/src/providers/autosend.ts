/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>AutoSend</b> integration.</span>
 * <a href="https://autosend.com">
 *  <img style={{display: "block"}} src="https://authjs.dev/img/providers/autosend.svg" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/autosend
 */

import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

export default function AutoSend(config: EmailUserConfig): EmailConfig {
  return {
    id: "autosend",
    type: "email",
    name: "AutoSend",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      const res = await fetch("https://api.autosend.com/v1/mails/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: { email: provider.from },
          to: { email: to },
          subject: `Sign in to ${host}`,
          html: html({ url, host, theme }),
          text: text({ url, host }),
          bypassSuppressions: true,
        }),
      })

      if (!res.ok)
        throw new Error("AutoSend error: " + JSON.stringify(await res.json()))
    },
    options: config,
  }
}
