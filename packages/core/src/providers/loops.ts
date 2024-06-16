import type { EmailConfig, EmailUserConfig } from "./email.js"
import type { Awaitable, Theme } from "../types.js"

export interface LoopsConfig extends EmailConfig {
  transactionalId: string
  dataVariables: {
    [key: string]: string
    token: string
  }
  sendVerificationRequest: (params: {
    identifier: string
    url: string
    expires: Date
    provider: LoopsConfig
    token: string
    theme: Theme
    request: Request
  }) => Awaitable<void>
}

export type LoopsUserConfig = Omit<Partial<LoopsConfig>, "options" | "type">

export default function Loops(config: LoopsUserConfig): LoopsConfig {
  if (!config.transactionalId)
    throw new Error("Loops requires a `transactionalId` configuration")
  return {
    id: "loops",
    type: "email",
    name: "Loops",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    transactionalId: "", // Add the missing property
    dataVariables: { token: "" }, // Add the missing property
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url } = params
      if (!provider.dataVariables.token)
        throw new Error("Loops requires a `token` data variable")
      const { host } = new URL(url)
      const res = await fetch("https://app.loops.so/api/v1/transactional", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionalId: provider.transactionalId,
          email: to,
          dataVariables: config.dataVariables,
        }),
      })

      if (!res.ok) {
        throw new Error("Loops Error: " + JSON.stringify(await res.json()))
      }
    },
    options: config,
  }
}
