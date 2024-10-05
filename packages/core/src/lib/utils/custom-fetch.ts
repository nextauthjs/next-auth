import * as o from "oauth4webapi"
import type { InternalProvider } from "../../types.js"

/** TODO: Document */
export const customFetch = Symbol("custom-fetch")

/** @internal */
export function fetchOpt(provider: InternalProvider<"oauth" | "oidc">) {
  return { [o.customFetch]: provider[customFetch] ?? fetch }
}

/** TODO: Document */
export const processResponse = Symbol("process-response")

export function processResponseInternal(
  provider: InternalProvider<"oauth" | "oidc">
) {
  return function (response: Response) {
    return provider[processResponse]?.(response.clone() ?? response)
  }
}
