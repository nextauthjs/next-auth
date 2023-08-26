import { InvalidCheck } from "../../errors.js"
import { decodeState } from "./checks.js"

import type { OAuthConfigInternal } from "../../providers/oauth.js"
import type { InternalOptions, RequestInternal } from "../../types.js"

/**
 * When the authorization flow contains a state, we check if it's a redirect proxy
 * and if so, we return the random state and the original redirect URL.
 */
export function handleState(
  query: RequestInternal["query"],
  provider: OAuthConfigInternal<any>,
  isOnRedirectProxy: InternalOptions["isOnRedirectProxy"]
) {
  let randomState: string | undefined
  let proxyRedirect: string | undefined

  if (provider.redirectProxyUrl && !query?.state) {
    throw new InvalidCheck(
      "Missing state in query, but required for redirect proxy"
    )
  }

  const state = decodeState(query?.state)
  randomState = state?.random

  if (isOnRedirectProxy) {
    if (!state?.origin) return { randomState }
    proxyRedirect = `${state.origin}?${new URLSearchParams(query)}`
  }

  return { randomState, proxyRedirect }
}
