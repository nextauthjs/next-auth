import { defaultCookies } from "./cookie.js"
import {
  InvalidCallbackUrl,
  InvalidEndpoints,
  MissingAdapter,
  MissingAdapterMethods,
  MissingAuthorize,
  MissingSecret,
  UnsupportedStrategy,
  UntrustedHost,
} from "../errors.js"

import type { AuthConfig, RequestInternal } from "../types.js"
import type { WarningCode } from "./utils/logger.js"

type ConfigError =
  | InvalidCallbackUrl
  | InvalidEndpoints
  | MissingAdapter
  | MissingAdapterMethods
  | MissingAuthorize
  | MissingSecret
  | UnsupportedStrategy

let warned = false

function isValidHttpUrl(url: string, baseUrl: string) {
  try {
    return /^https?:/.test(
      new URL(url, url.startsWith("/") ? baseUrl : undefined).protocol
    )
  } catch {
    return false
  }
}

/**
 * Verify that the user configured Auth.js correctly.
 * Good place to mention deprecations as well.
 */
export function assertConfig(
  request: RequestInternal,
  options: AuthConfig
): ConfigError | WarningCode[] {
  const { url } = request
  const warnings: WarningCode[] = []

  if (!warned && options.debug) warnings.push("debug-enabled")

  if (!options.trustHost) {
    return new UntrustedHost(`Host must be trusted. URL was: ${request.url}`)
  }

  if (!options.secret) {
    return new MissingSecret("Please define a `secret`.")
  }

  const callbackUrlParam = request.query?.callbackUrl as string | undefined

  if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlParam}`
    )
  }

  const { callbackUrl: defaultCallbackUrl } = defaultCookies(
    options.useSecureCookies ?? url.protocol === "https://"
  )
  const callbackUrlCookie =
    request.cookies?.[
      options.cookies?.callbackUrl?.name ?? defaultCallbackUrl.name
    ]

  if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlCookie}`
    )
  }

  let hasCredentials, hasEmail

  for (const provider of options.providers) {
    if (
      (provider.type === "oauth" || provider.type === "oidc") &&
      !(provider.issuer ?? provider.options?.issuer)
    ) {
      const { authorization: a, token: t, userinfo: u } = provider

      let key
      if (typeof a !== "string" && !a?.url) key = "authorization"
      else if (typeof t !== "string" && !t?.url) key = "token"
      else if (typeof u !== "string" && !u?.url) key = "userinfo"

      if (key) {
        return new InvalidEndpoints(
          `Provider "${provider.id}" is missing both \`issuer\` and \`${key}\` endpoint config. At least one of them is required.`
        )
      }
    }

    if (provider.type === "credentials") hasCredentials = true
    else if (provider.type === "email") hasEmail = true
  }

  if (hasCredentials) {
    const dbStrategy = options.session?.strategy === "database"
    const onlyCredentials = !options.providers.some(
      (p) => p.type !== "credentials"
    )
    if (dbStrategy && onlyCredentials) {
      return new UnsupportedStrategy(
        "Signin in with credentials only supported if JWT strategy is enabled"
      )
    }

    const credentialsNoAuthorize = options.providers.some(
      (p) => p.type === "credentials" && !p.authorize
    )
    if (credentialsNoAuthorize) {
      return new MissingAuthorize(
        "Must define an authorize() handler to use credentials authentication provider"
      )
    }
  }

  if (hasEmail) {
    const { adapter } = options
    if (!adapter) {
      return new MissingAdapter("E-mail login requires an adapter.")
    }

    const missingMethods = (
      [
        "createVerificationToken",
        "useVerificationToken",
        "getUserByEmail",
      ] as const
    ).filter((method) => !adapter[method])

    if (missingMethods.length) {
      return new MissingAdapterMethods(
        `Required adapter methods were missing: ${missingMethods.join(", ")}`
      )
    }
  }

  if (!warned) warned = true

  return warnings
}
