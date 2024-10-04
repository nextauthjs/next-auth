import * as o from "oauth4webapi"
import type { InternalProvider } from "../../types.js"

/** TODO: Document */
export const customFetch = Symbol("custom-fetch")

/** @internal */
export function fetchOpt(provider: InternalProvider<"oauth" | "oidc">) {
  return { [o.customFetch]: provider[customFetch] ?? fetch }
}
