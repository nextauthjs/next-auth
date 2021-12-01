import { createTransport } from "nodemailer"

import type { CommonProviderOptions } from "."
import type { Options as SMTPConnectionOptions } from "nodemailer/lib/smtp-connection"
import type { Awaitable } from ".."

export interface EmailConfig extends CommonProviderOptions {
  type: "email"
  // TODO: Make use of https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html
  server: string | SMTPConnectionOptions
  /** @default "NextAuth <no-reply@example.com>" */
  from?: string
  /**
   * How long until the e-mail can be used to log the user in,
   * in seconds. Defaults to 1 day
   * @default 86400
   */
  maxAge?: number
  sendVerificationRequest: (params: {
    identifier: string
    url: string
    expires: Date
    provider: EmailConfig
    token: string
  }) => Awaitable<void>
  /**
   * By default, we are generating a random verification token.
   * You can make it predictable or modify it as you like with this method.
   * @example
   * ```js
   *  Providers.Email({
   *    async generateVerificationToken() {
   *      return "ABC123"
   *    }
   *  })
   * ```
   * [Documentation](https://next-auth.js.org/providers/email#customising-the-verification-token)
   */
  generateVerificationToken?: () => Awaitable<string>
  /** If defined, it is used to hash the verification token when saving to the database . */
  secret?: string
  options: EmailUserConfig
}

export type EmailUserConfig = Partial<Omit<EmailConfig, "options">>

export type EmailProvider = (options: EmailUserConfig) => EmailConfig

// TODO: Rename to Token provider
// when started working on https://github.com/nextauthjs/next-auth/discussions/1465
export type EmailProviderType = "Email"

export default function Email(options: EmailUserConfig): EmailConfig {
  return {
    id: "email",
    type: "email",
    name: "Email",
    // Server can be an SMTP connection string or a nodemailer config object
    server: {
      host: "localhost",
      port: 25,
      auth: {
        user: "",
        pass: "",
      },
    },
    from: "NextAuth <no-reply@example.com>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest({
      identifier: email,
      url,
      provider: { server, from },
    }) {
      const { host } = new URL(url)
      const transport = createTransport(server)
      await transport.sendMail({
        to: email,
        from,
        subject: `Sign in to ${host}`,
        text: text({ url, host }),
        html: html({ url, host, email }),
      })
    },
    options,
  }
}

// Email HTML body
function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`

  // Some simple styling options
  const backgroundColor = "#f9f9f9"
  const textColor = "#444444"
  const mainBackgroundColor = "#ffffff"
  const buttonBackgroundColor = "#346df1"
  const buttonBorderColor = "#346df1"
  const buttonTextColor = "#ffffff"

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Sign in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
  return `Sign in to ${host}\n${url}\n\n`
}
