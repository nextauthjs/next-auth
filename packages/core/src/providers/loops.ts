/**
 * <div style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Loops</b> integration.</span>
 * <a href="https://loops.so">
 *  <img style={{display: "block"}} src="https://authjs.dev/img/providers/loops.svg" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/loops
 */

import type { EmailConfig, EmailProviderSendVerificationRequestParams, EmailProviderType } from "./email.js"
import type { Awaitable, Theme } from "../types.js"


interface VerificationParams extends Omit<EmailProviderSendVerificationRequestParams, 'provider'> {
  provider: LoopsConfig;
  transactionalId: string;
}

export type LoopsUserConfig = Omit<Partial<LoopsConfig>, "options" | "type" >;

export interface LoopsConfig extends Omit<EmailConfig, 'sendVerificationRequest' | 'options'>{
  id: string;
  apiKey: string;
  transactionalId: string;
  sendVerificationRequest: (params: VerificationParams) => Awaitable<void>;
  options: LoopsUserConfig;
}

/**
 * 
 * @param config 
 * @returns LoopsConfig
 * @requires LoopsUserConfig
 * @example
 * ```ts
 * Loops({
 *  apiKey: process.env.LOOPS_API_KEY,
 * transactionalId: process.env.LOOPS_TRANSACTIONAL_ID,
 * })
 * ```
 * 
 * @typedef LoopsUserConfig 
 */

export default function Loops(config: LoopsUserConfig): LoopsConfig {
  return {
    apiKey: "", 
    id: "loops",
    type: "email" as EmailProviderType,
    name: "Loops",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    transactionalId: config.transactionalId || "", 
    async sendVerificationRequest(params: VerificationParams): Promise<void> {
      const { identifier: to, provider, url } = params
      const res = await fetch("https://app.loops.so/api/v1/transactional", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionalId: provider.transactionalId,
          email: to,
          dataVariables: {
            url: url,
          },
        }),
      })
      if (!res.ok) {
        throw new Error("Loops Error: " + JSON.stringify(await res.json()))
      }
    },
    options: config,
  }
}
