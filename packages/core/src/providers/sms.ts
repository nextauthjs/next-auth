import { CommonProviderOptions } from "./index.js"
import { Awaitable, Theme } from "../types.js"
import { Adapter, AdapterUser, VerificationToken } from "../adapters.js"

export type SmsProviderSendVerificationRequestParams = {
  identifier: string
  url: string
  expires: Date
  provider: SMSConfig
  token: string
  theme: Theme
  request: Request
}

export type SmsProviderGenerateVerificationTokenParams = {
  identifier: string
  user: AdapterUser | null
  provider: SMSConfig
  theme: Theme
  request: Request
}

export type SmsProviderCheckVerificationTokenParams = {
  identifier: string
  url: string
  expires: Date
  provider: SMSConfig
  secret: string | string[]
  token: string
  theme: Theme
  request: Request
  adapter?: Required<Adapter>
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
  generateVerificationToken?: (
    params: SmsProviderGenerateVerificationTokenParams
  ) => Awaitable<string>
  checkVerificationRequest?: (
    params: SmsProviderCheckVerificationTokenParams
  ) => Awaitable<VerificationToken | null>
  normalizeIdentifier?: (identifier: string) => string
  verifyCaptchaToken?: (captcha_token: string) => Awaitable<boolean>
  options?: SMSUserConfig
}

export type SMSUserConfig = Omit<Partial<SMSConfig>, "options" | "type">

export default function SMSProvider(config: SMSUserConfig): SMSConfig {
  return {
    id: "sms",
    type: "sms",
    name: "SMS",
    maxAge: 5 * 60,
    async generateVerificationToken() {
      const random = crypto.getRandomValues(new Uint8Array(6))
      return Array.from(random, (byte) => byte % 10).join("")
    },
    async sendVerificationRequest(params) {
      throw new Error(`sendVerificationRequest not implemented: ${params}`)
    },
    options: config,
  }
}
