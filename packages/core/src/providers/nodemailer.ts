import { createTransport } from "nodemailer"
import { html, text } from "../lib/utils/email.js"
import { AuthError } from "../errors.js"

import type { Transport, TransportOptions } from "nodemailer"
import * as JSONTransport from "nodemailer/lib/json-transport/index.js"
import * as SendmailTransport from "nodemailer/lib/sendmail-transport/index.js"
import * as SESTransport from "nodemailer/lib/ses-transport/index.js"
import * as SMTPTransport from "nodemailer/lib/smtp-transport/index.js"
import * as SMTPPool from "nodemailer/lib/smtp-pool/index.js"
import * as StreamTransport from "nodemailer/lib/stream-transport/index.js"
import type { Awaitable, Theme } from "../types.js"
import type { EmailConfig } from "./email.js"

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

export interface NodemailerConfig extends EmailConfig {
  server?: AllTransportOptions
  sendVerificationRequest: (params: {
    identifier: string
    url: string
    expires: Date
    provider: NodemailerConfig
    token: string
    theme: Theme
    request: Request
  }) => Awaitable<void>
  options: NodemailerUserConfig
}

export type NodemailerUserConfig = Omit<
  Partial<NodemailerConfig>,
  "options" | "type"
>

export default function Nodemailer(
  config: NodemailerUserConfig
): NodemailerConfig {
  if (!config.server)
    throw new AuthError("Nodemailer requires a `server` configuration")

  return {
    id: "nodemailer",
    type: "email",
    name: "Nodemailer",
    server: { host: "localhost", port: 25, auth: { user: "", pass: "" } },
    from: "Auth.js <no-reply@authjs.dev>",
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
    options: config,
  }
}
