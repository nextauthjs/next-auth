import { CommonProviderOptions } from "."
import { Options as SMTPConnectionOptions } from "nodemailer/lib/smtp-connection"
import { Awaitable } from "../internals/utils"

export type SendVerificationRequest = (params: {
  identifier: string
  url: string
  baseUrl: string
  token: string
  provider: EmailConfig
}) => Awaitable<void>

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
  sendVerificationRequest: SendVerificationRequest
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
