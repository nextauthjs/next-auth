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
