import {
  MissingAdapter,
  MissingAPIRoute,
  MissingAuthorize,
  MissingSecret,
  UnsupportedStrategy,
  InvalidCallbackUrl,
  MissingAdapterMethods,
} from "../errors"
import parseUrl from "../../utils/parse-url"
import { defaultCookies } from "./cookie"

import type { RequestInternal } from ".."
import type { WarningCode } from "../../utils/logger"
import type { AuthOptions } from "../types"

type ConfigError =
  | MissingAPIRoute
  | MissingSecret
  | UnsupportedStrategy
  | MissingAuthorize
  | MissingAdapter

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
 * Verify that the user configured `next-auth` correctly.
 * Good place to mention deprecations as well.
 *
 * REVIEW: Make some of these and corresponding docs less Next.js specific?
 */
export function assertConfig(params: {
  options: AuthOptions
  req: RequestInternal
}): ConfigError | WarningCode[] {
  const { options, req } = params

  const warnings: WarningCode[] = []

  if (!warned) {
    if (!req.origin) warnings.push("NEXTAUTH_URL")

    // TODO: Make this throw an error in next major. This will also get rid of `NODE_ENV`
    if (!options.secret && process.env.NODE_ENV !== "production")
      warnings.push("NO_SECRET")

    if (options.debug) warnings.push("DEBUG_ENABLED")
  }

  if (!options.secret && process.env.NODE_ENV === "production") {
    return new MissingSecret("Please define a `secret` in production.")
  }

  // req.query isn't defined when asserting `getServerSession` for example
  if (!req.query?.nextauth && !req.action) {
    return new MissingAPIRoute(
      "Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly."
    )
  }

  const callbackUrlParam = req.query?.callbackUrl as string | undefined

  const url = parseUrl(req.origin)

  if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.base)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlParam}`
    )
  }

  const { callbackUrl: defaultCallbackUrl } = defaultCookies(
    options.useSecureCookies ?? url.base.startsWith("https://")
  )
  const callbackUrlCookie =
    req.cookies?.[options.cookies?.callbackUrl?.name ?? defaultCallbackUrl.name]

  if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.base)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlCookie}`
    )
  }

  let hasCredentials, hasEmail
  let hasTwitterOAuth2

  for (const provider of options.providers) {
    if (provider.type === "credentials") hasCredentials = true
    else if (provider.type === "email") hasEmail = true
    else if (provider.id === "twitter" && provider.version === "2.0")
      hasTwitterOAuth2 = true
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

  if (!warned) {
    if (hasTwitterOAuth2) warnings.push("TWITTER_OAUTH_2_BETA")
    warned = true
  }

  return warnings
}
