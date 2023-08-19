import type { CommonProviderOptions, ProviderType } from "./index.js"
import type { Awaitable, Theme } from "../types.js"

export interface SendVerificationRequestParams<ProviderConfig> {
  identifier: string
  url: string
  expires: Date
  provider: ProviderConfig
  token: string
  theme: Theme
  request: Request
}

export type TokenProviderType = Extract<ProviderType, "email" | "token">

/**
 * The Token Provider needs to be configured with a token provider that can send the token to the end user.
 */
export type TokenConfig<ProviderConfig = {}> = CommonProviderOptions &
  ProviderConfig & {
    type: "token"
    maxAge?: number
    /** [Documentation](https://authjs.dev/reference/providers/email#customizing-emails) */
    sendVerificationRequest: (
      params: SendVerificationRequestParams<ProviderConfig>
    ) => Awaitable<void>
    /**
     * By default, we are generating a random verification token.
     * You can make it predictable or modify it as you like with this method.
     *
     * @example
     * ```ts
     *  Providers.Token({
     *    async generateVerificationToken() {
     *      return "ABC123"
     *    }
     *  })
     * ```
     * [Documentation](https://authjs.dev/reference/providers/token#customizing-the-verification-token)
     */
    generateVerificationToken?: () => Awaitable<string>
    /** If defined, it is used to hash the verification token when saving to the database . */
    secret?: string
    /**
     * Normalizes the user input before sending the verification request.
     */
    normalizeIdentifier?: (identifier: string) => string
    options: ProviderConfig
  }

export default function Token(config: TokenConfig): TokenConfig {
  return {
    id: "token",
    type: "token",
    name: "Token",
    maxAge: 24 * 60 * 60,
    async sendVerificationRequest() {
      throw new Error(
        "Not implemented. When using the vanilla Token provider, we expect the developer to implement this method in the application code."
      )
    },
    options: config,
  }
}
