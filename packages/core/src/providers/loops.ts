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

import type { EmailConfig, EmailUserConfig } from "./email.js"

/**
 * 
 * @param config 
 * @returns LoopsConfig
 * @requires LoopsUserConfig
 * @example
 * ```ts
 * Loops({
 *   apiKey: process.env.AUTH_LOOPS_KEY,
 *   transactionalId: process.env.AUTH_LOOPS_TRANSACTIONAL_ID,
 * })
 * ```
 * 
 * @typedef LoopsUserConfig 
 */

export default function Loops(config: EmailUserConfig): EmailConfig {
  return {
    id: "loops",
    type: "email",
    name: "Loops",
    from: "Auth.js <no-reply@authjs.dev>",
    maxAge: 24 * 60 * 60,
    transactionalId: config.transactionalId || "", 
    async sendVerificationRequest(params) {
      const { identifier: to, provider, url } = params
      if (!provider.apiKey) throw new TypeError("Missing Loops API Key")

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
        throw new Error("Loops Send Error: " + JSON.stringify(await res.json()))
      }
    },
    options: config,
  }
}
