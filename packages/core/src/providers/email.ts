import type { CommonProviderOptions } from "./index.js"
import type { Awaitable, Theme } from "../types.js"

// TODO: Kepts for backwards compatibility
// Remove this import and encourage users
// to import it from @auth/core/providers/nodemailer directly
import Nodemailer from "./nodemailer.js"
import type { NodemailerConfig, NodemailerUserConfig } from "./nodemailer.js"

/**
 * @deprecated
 *
 * Import this provider from the `providers/nodemailer` submodule instead of `providers/email`.
 *
 * To log in with nodemailer, change `signIn("email")` to `signIn("nodemailer")`
 */
export default function Email(config: NodemailerUserConfig): NodemailerConfig {
  return {
    ...Nodemailer(config),
    id: "email",
    name: "Email",
  }
}

// TODO: Rename to Token provider
// when started working on https://github.com/nextauthjs/next-auth/discussions/1465
export type EmailProviderType = "email"

export interface EmailConfig extends CommonProviderOptions {
  id: string
  type: EmailProviderType
  name: string
  from: string
  maxAge: number
  sendVerificationRequest: (params: {
    identifier: string
    url: string
    expires: Date
    provider: EmailConfig
    token: string
    theme: Theme
    request: Request
  }) => Awaitable<void>
  /** Used to hash the verification token. */
  secret?: string
  /** Used with HTTP-based email providers. */
  apiKey?: string
  /** Used with SMTP-based email providers. */
  server?: NodemailerConfig["server"]
  generateVerificationToken?: () => Awaitable<string>
  normalizeIdentifier?: (identifier: string) => string
  options: EmailUserConfig
}

export type EmailUserConfig = Omit<Partial<EmailConfig>, "options" | "type">

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
export function html(params: { url: string; host: string; theme: Theme }) {
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
export function text({ url, host }: { url: string; host: string }) {
  return `Sign in to ${host}\n${url}\n\n`
}
