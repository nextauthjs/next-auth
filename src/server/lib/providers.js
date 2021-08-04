import { merge } from "../../lib/merge"

/**
 * Adds `signinUrl` and `callbackUrl` to each provider
 * and deep merge user-defined options.
 * @param {{
 *  providers: import("types/providers").Provider[]
 *  baseUrl: string
 *  basePath: string
 * }} options
 * @returns {import("types/internals").InternalOptions["providers"]}
 */
export default function parseProviders({ providers = [], baseUrl, basePath }) {
  const base = `${baseUrl}${basePath}`
  return providers.map(({ options, ...defaultOptions }) =>
    merge(defaultOptions, {
      signinUrl: `${base}/signin/${defaultOptions.id}`,
      callbackUrl: `${base}/callback/${defaultOptions.id}`,
      ...options,
    })
  )
}
