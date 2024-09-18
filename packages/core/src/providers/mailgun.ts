/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Mailgun</b> integration.</span>
 * <a href="https://www.mailgun.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/mailgun.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/mailgun
 */
import type { EmailConfig, EmailUserConfig } from "./index.js"
import { html, text } from "../lib/utils/email.js"

/**
 * Add Mailgun login to your page.
 *
 * ### Setup
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import Mailgun from "@auth/core/providers/mailgun"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     Mailgun({ from: MAILGUN_DOMAIN }),
 *   ],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Mailgun documentation](https://documentation.mailgun.com/docs/mailgun)
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
export default function MailGun(config: EmailUserConfig): EmailConfig {
  return {
    id: "mailgun",
    type: "email",
    name: "Mailgun",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url, theme } = params
      const { host } = new URL(url)
      const domain = provider.from?.split("@").at(1)

      if (!domain) throw new Error("malformed Mailgun domain")

      const form = new FormData()
      form.append("from", `${provider.name} <${provider.from}>`)
      form.append("to", to)
      form.append("subject", `Sign in to ${host}`)
      form.append("html", html({ host, url, theme }))
      form.append("text", text({ host, url }))

      const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`api:${provider.apiKey}`)}`,
        },
        body: form,
      })

      if (!res.ok) throw new Error("Mailgun error: " + (await res.text()))
    },
    options: config,
  }
}
