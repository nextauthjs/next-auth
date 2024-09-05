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


interface VerificationParams extends EmailProviderSendVerificationRequestParams {
  transactionalId: string;
}

export type LoopsUserConfig = Omit<Partial<LoopsConfig>, "options" | "type" >;

export interface LoopsConfig extends Omit<EmailConfig, 'sendVerificationRequest'>{
  id: string;
  apiKey: string;
  transactionalId: string;
  options: LoopsUserConfig;
}



export default function Loops(config: LoopsUserConfig): LoopsConfig {
  const defaultConfig = {
    apiKey: "", 
    id: "loops",
    type: "email" as EmailProviderType,
    name: "Loops",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    transactionalId: config.transactionalId || "", 
    async sendVerificationRequest(params: VerificationParams) {
      const { identifier: to, provider, url, transactionalId } = params
      const res = await fetch("https://app.loops.so/api/v1/transactional", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionalId: transactionalId,
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

  return {
    ...defaultConfig,
    ...config,
  } as LoopsConfig
}

/**
 * Set Loops as the provider for Email Authentication.
 *
 * ### Setup
 * In your Loops account, create a new Transactional Email from the [Loops Dashboard](https://app.loops.so/).
 * You can do this starting with one of the [Template](https://app.loops.so/templates), or start from scratch.
 *
 * #### Configuration
 * ```ts
 * import { Auth } from "@auth/core"
 * import Loops from "@auth/core/providers/loops"
 *
 * export const { handlers, auth, signIn, signOut } = Next-Auth({
 * adapter: ..., // Make sure you include an adapter, email verification requires this.
 *  providers: [
 *   Loops({
 *    transactionalId: process.env.LOOPS_TRANSACTIONAL_ID,
 *   apiKey: process.env.LOOPS_API_KEY,
 *  }),
 * ],
 * })
 * ```
 *
 */
