import { Transport, TransportOptions, createTransport } from "nodemailer"
import * as JSONTransport from "nodemailer/lib/json-transport/index.js"
import * as SendmailTransport from "nodemailer/lib/sendmail-transport/index.js"
import * as SESTransport from "nodemailer/lib/ses-transport/index.js"
import * as SMTPPool from "nodemailer/lib/smtp-pool/index.js"
import * as SMTPTransport from "nodemailer/lib/smtp-transport/index.js"
import * as StreamTransport from "nodemailer/lib/stream-transport/index.js"
import type { Awaitable } from ".."
import type { CommonProviderOptions } from "."
import type { Theme } from "../core/types"

// TODO: Make use of https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html for the string
type AllTransportOptions =
  | string
  | SMTPTransport
  | SMTPTransport.Options
  | SMTPPool
  | SMTPPool.Options
  | SendmailTransport
  | SendmailTransport.Options
  | StreamTransport
  | StreamTransport.Options
  | JSONTransport
  | JSONTransport.Options
  | SESTransport
  | SESTransport.Options
  | Transport<any>
  | TransportOptions

export interface SendVerificationRequestParams {
  identifier: string
  url: string
  expires: Date
  provider: EmailConfig
  token: string
  theme: Theme
}

export interface EmailUserConfig {
  server?: AllTransportOptions
  type?: "email"
  /** @default "NextAuth <no-reply@example.com>" */
  from?: string
  /**
   * How long until the e-mail can be used to log the user in,
   * in seconds. Defaults to 1 day
   * @default 86400
   */
  maxAge?: number
  /** [Documentation](https://next-auth.js.org/providers/email#customizing-emails) */
  sendVerificationRequest?: (
    params: SendVerificationRequestParams
  ) => Awaitable<void>
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
   * [Documentation](https://next-auth.js.org/providers/email#customizing-the-verification-token)
   */
  generateVerificationToken?: () => Awaitable<string>
  /** If defined, it is used to hash the verification token when saving to the database . */
  secret?: string
  /**
   * Normalizes the user input before sending the verification request.
   *
   * ⚠️ Always make sure this method returns a single email address.
   *
   * @note Technically, the part of the email address local mailbox element
   * (everything before the `@` symbol) should be treated as 'case sensitive'
   * according to RFC 2821, but in practice this causes more problems than
   * it solves, e.g.: when looking up users by e-mail from databases.
   * By default, we treat email addresses as all lower case,
   * but you can override this function to change this behavior.
   *
   * [Documentation](https://next-auth.js.org/providers/email#normalizing-the-e-mail-address) | [RFC 2821](https://tools.ietf.org/html/rfc2821) | [Email syntax](https://en.wikipedia.org/wiki/Email_address#Syntax)
   */
  normalizeIdentifier?: (identifier: string) => string
}

export interface EmailConfig extends CommonProviderOptions {
  // defaults
  id: "email"
  type: "email"
  name: "Email"
  server: AllTransportOptions
  from: string
  maxAge: number
  sendVerificationRequest: (
    params: SendVerificationRequestParams
  ) => Awaitable<void>

  /**
   * This is copied into EmailConfig in parseProviders() don't use elsewhere
   */
  options: EmailUserConfig

  // user options
  // TODO figure out a better way than copying from EmailUserConfig
  secret?: string
  generateVerificationToken?: () => Awaitable<string>
  normalizeIdentifier?: (identifier: string) => string
}

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
    server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
    from: "NextAuth <no-reply@example.com>",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest(params) {
      const { identifier, url, provider, theme } = params
      const { host } = new URL(url)
      const transport = createTransport(provider.server)
      const result = await transport.sendMail({
        to: identifier,
        from: provider.from,
        subject: `Sign in to ${host}`,
        text: text({ url, host }),
        html: html({ url, host, theme }),
      })
      const failed = result.rejected.concat(result.pending).filter(Boolean)
      if (failed.length) {
        throw new Error(`Email (${failed.join(", ")}) could not be sent`)
      }
    },
    options,
  }
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: { url: string; host: string; theme: Theme }) {
  const { url, host, theme } = params

  const escapedHost = host.replace(/\./g, "&#8203;.")

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const brandColor = theme.brandColor || "#346df1"
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const buttonText = theme.buttonText || "#fff"

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  }

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                in</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
