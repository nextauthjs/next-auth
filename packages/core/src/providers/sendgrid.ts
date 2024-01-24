import type { EmailConfig, EmailUserConfig } from "./index.js"

/** @todo Document this */
export default function Sendgrid(config: EmailUserConfig): EmailConfig {
  return {
    id: "sendgrid",
    type: "email",
    name: "Sendgrid",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      throw new Error("Not yet implemented")
    },
    options: config,
  }
}
