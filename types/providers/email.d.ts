import { CommonProviderOptions } from "."
import { Options as SMTPConnectionOptions } from "nodemailer/lib/smtp-connection"
import { Awaitable } from "../internals/utils"

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
  sendVerificationRequest(params: {
    identifier: string
    url: string
    expires: Date
    provider: EmailConfig
    token: string
  }): Awaitable<void>
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
  generateVerificationToken?(): Awaitable<string>
}

export type EmailProvider = (options: Partial<EmailConfig>) => EmailConfig

// TODO: Rename to Token provider
// when started working on https://github.com/nextauthjs/next-auth/discussions/1465
export type EmailProviderType = "Email"

declare module "next-auth/providers/email" {
  export default function EmailProvider(
    options: Partial<EmailConfig>
  ): EmailConfig
}
