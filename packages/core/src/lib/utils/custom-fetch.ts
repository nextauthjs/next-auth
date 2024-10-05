import * as o from "oauth4webapi"
import type { InternalProvider } from "../../types.js"

/**
 * This advanced option allows you to override the default `fetch` function used by the provider
 * to make requests to the provider's OAuth endpoints.
 *
 * It can be used to support corporate proxies, custom fetch libraries, cache discovery endpoints,
 * add mocks for testing, logging, set custom headers/params for non-spec compliant providers, etc.
 *
 * @example
 * ```ts
 * import { Auth, customFetch } from "@auth/core"
 * import GitHub from "@auth/core/providers/github"
 *
 * const dispatcher = new ProxyAgent("my.proxy.server")
 * function proxy(...args: Parameters<typeof fetch>): ReturnType<typeof fetch> {
 *   return undici(args[0], { ...(args[1] ?? {}), dispatcher })
 * }
 *
 * const response = await Auth(request, {
 *   providers: [GitHub({ [customFetch]: proxy })]
 * })
 * ```
 *
 * @see https://undici.nodejs.org/#/docs/api/ProxyAgent?id=example-basic-proxy-request-with-local-agent-dispatcher
 * @see https://authjs.dev/guides/corporate-proxy
 */
export const customFetch = Symbol("custom-fetch")

/** @internal */
export function fetchOpt(provider: InternalProvider<"oauth" | "oidc">) {
  return { [o.customFetch]: provider[customFetch] ?? fetch }
}
