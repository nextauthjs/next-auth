import {
  InvalidCallbackUrl,
  InvalidEndpoints,
  MissingAdapter,
  MissingAdapterMethods,
  MissingAPIRoute,
  MissingAuthorize,
  MissingSecret,
  UnsupportedStrategy,
} from "./errors.js"
import { defaultCookies } from "./cookie.js"

import type { AuthOptions, RequestInternal } from "../index.js"
import type { WarningCode } from "./utils/logger.js"

type ConfigError =
  | MissingAdapter
  | MissingAdapterMethods
  | MissingAPIRoute
  | MissingAuthorize
  | MissingSecret
  | InvalidCallbackUrl
  | UnsupportedStrategy
  | InvalidEndpoints
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
 *
 * REVIEW: Make some of these and corresponding docs less Next.js specific?
 */
export function assertConfig(params: {
  options: AuthOptions
  req: RequestInternal
}): ConfigError | WarningCode[] {
  const { options, req } = params
  const { url } = req
  const warnings: WarningCode[] = []

  if (!warned) {
    if (!url.origin) warnings.push("NEXTAUTH_URL")
    if (options.debug) warnings.push("DEBUG_ENABLED")
  }

  if (!options.secret) {
    return new MissingSecret("Please define a `secret`.")
  }

  // req.query isn't defined when asserting `unstable_getServerSession` for example
  if (!req.query?.nextauth && !req.action) {
    return new MissingAPIRoute(
      "Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly."
    )
  }

  const callbackUrlParam = req.query?.callbackUrl as string | undefined

  if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.origin)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlParam}`
    )
  }

  const { callbackUrl: defaultCallbackUrl } = defaultCookies(
    options.useSecureCookies ?? url.protocol === "https://"
  )
  const callbackUrlCookie =
    req.cookies?.[options.cookies?.callbackUrl?.name ?? defaultCallbackUrl.name]

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

    const missingMethods = [
      "createVerificationToken",
      "useVerificationToken",
      "getUserByEmail",
    ].filter((method) => !adapter[method])

    if (missingMethods.length) {
      return new MissingAdapterMethods(
        `Required adapter methods were missing: ${missingMethods.join(", ")}`
      )
    }
  }

  if (!warned) warned = true

  return warnings
}
