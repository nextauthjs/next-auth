import { OutgoingResponse } from ".."
import { InternalProvider } from "../../lib/types"

export interface PublicProvider {
  id: string
  name: string
  type: string
  signinUrl: string
  callbackUrl: string
}

/**
 * Return a JSON object with a list of all OAuth providers currently configured
 * and their signin and callback URLs. This makes it possible to automatically
 * generate buttons for all providers when rendering client side.
 */
export default function providers(
  providers: InternalProvider[]
): OutgoingResponse<Record<string, PublicProvider>> {
  return {
    headers: [{ key: "Content-Type", value: "application/json" }],
    body: providers.reduce<Record<string, PublicProvider>>(
      (acc, { id, name, type, signinUrl, callbackUrl }) => {
        acc[id] = { id, name, type, signinUrl, callbackUrl }
        return acc
      },
      {}
    ),
  }
}
