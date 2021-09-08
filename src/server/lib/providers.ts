import { InternalProvider } from "src/lib/types"
import { Provider } from "../../providers"
import { merge } from "../../lib/merge"

/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 */
export default function parseProviders(params: {
  providers: Provider[]
  base: string
}): InternalProvider[] {
  const { providers = [], base } = params
  return providers.map(({ options, ...defaultOptions }) =>
    merge(defaultOptions, {
      signinUrl: `${base}/signin/${options?.id ?? defaultOptions.id}`,
      callbackUrl: `${base}/callback/${options?.id ?? defaultOptions.id}`,
      ...options,
    })
  )
}
