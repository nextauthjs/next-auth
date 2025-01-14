import { CommonProviderOptions } from "./index.js"
import { Awaitable, Theme } from "../types.js"

export type SmsProviderSendVerificationRequestParams = {
  identifier: string
  url: string
  expires: Date
  provider: SMSConfig
  token: string
  theme: Theme
  request: Request
}

export interface SMSConfig extends CommonProviderOptions {
  id: string
  type: "sms"
  maxAge?: number
  sendVerificationRequest: (
    params: SmsProviderSendVerificationRequestParams
  ) => Awaitable<void>
  /** Used to hash the verification token. */
  secret?: string
  generateVerificationToken?: () => Awaitable<string>
  normalizeIdentifier?: (identifier: string) => string
  options?: SMSUserConfig
}

export type SMSUserConfig = Omit<Partial<SMSConfig>, "options" | "type">

export default function SMSProvider(config: SMSUserConfig): SMSConfig {
  return {
    id: "resend",
    type: "sms",
    name: "SMS",
    maxAge: 5 * 60,
    async generateVerificationToken() {
      const random = crypto.getRandomValues(new Uint8Array(8))
      return Buffer.from(random).toString("hex").slice(0, 6)
    },
    async sendVerificationRequest(params) {
      throw new Error(`sendVerificationRequest not implemented: ${params}`)
    },
    options: config,
  }
}
