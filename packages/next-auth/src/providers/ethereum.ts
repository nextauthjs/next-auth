import type { Awaitable, LoggerInstance } from ".."
import { SiweMessage, VerifyOpts } from "siwe"

import type { CommonProviderOptions } from "."
import type { RequestInternal } from "../core"

/**
 * Body type for the POST /callback/ethereum endpoint
 */
export interface EthereumInput {
  message: string
  signature: string
  csrfToken: string
}

export interface EthereumConfig extends CommonProviderOptions {
  type: "ethereum"
  siweVerifyOptions: VerifyOpts
  verifySignature: (
    parameters: {
      csrfToken: string
      domain: string
      message: string
      signature: string
    },
    req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
  ) => Awaitable<{ address: string } | null>
}

export type EthereumProvider = (
  options: Partial<EthereumConfig>
) => EthereumConfig

export type EthereumProviderType = "Ethereum"

type UserEthereumConfig = Partial<
  Omit<EthereumConfig, "options" | "verifySignature">
>

/**
 * Enables authentication with NextAuth using an Ethereum wallet
 * via Sign-In with Ethereum (https://login.xyz/)
 */
export default function Ethereum(options: UserEthereumConfig = {}): EthereumConfig {
  return {
    id: "ethereum",
    name: "Ethereum",
    type: "ethereum",
    siweVerifyOptions: options.siweVerifyOptions ?? {},
    verifySignature: async (parameters: {
      csrfToken: string
      domain: string
      message: string
      signature: string
      logger?: LoggerInstance
    }): Promise<{ address: string } | null> => {
      try {
        const siwe = new SiweMessage(parameters.message)

        const siweResponse = await siwe.verify(
          {
            domain: parameters.domain,
            nonce: parameters.csrfToken,
            signature: parameters.signature,
            time: new Date().toISOString(),
          },
          options.siweVerifyOptions ?? {}
        )

        if (!siweResponse.success) {
          throw new Error(siweResponse.error ? siweResponse.error.type : "Eth signature invalid")
        }

        return {
          address: siwe.address,
        }
      } catch (e) {
        parameters.logger?.warn(e)
        return null
      }
    },
    options,
  }
}
