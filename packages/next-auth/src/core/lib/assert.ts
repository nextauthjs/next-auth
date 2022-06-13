import {
  MissingAdapter,
  MissingAPIRoute,
  MissingAuthorize,
  MissingSecret,
  UnsupportedStrategy,
  InvalidCallbackUrl,
} from "../errors"
import parseUrl from "../../utils/parse-url"
import { defaultCookies } from "./cookie"

import type { NextAuthHandlerParams, RequestInternal } from ".."
import type { WarningCode } from "../../utils/logger"

type ConfigError =
  | MissingAPIRoute
  | MissingSecret
  | UnsupportedStrategy
  | MissingAuthorize
  | MissingAdapter

let twitterWarned = false

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
export function assertConfig(
  params: NextAuthHandlerParams & {
    req: RequestInternal
  }
): ConfigError | WarningCode | undefined {
  const { options, req } = params

  // req.query isn't defined when asserting `getServerSession` for example
  if (!req.query?.nextauth && !req.action) {
    return new MissingAPIRoute(
      "Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly."
    )
  }

  if (!options.secret) {
    if (process.env.NODE_ENV === "production") {
      return new MissingSecret("Please define a `secret` in production.")
    } else {
      return "NO_SECRET"
    }
  }

  const callbackUrlParam = req.query?.callbackUrl as string | undefined

  const url = parseUrl(req.host)

  if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.base)) {
    return new InvalidCallbackUrl(
      `Invalid callback URL. Received: ${callbackUrlParam}`
    )
  }

  // This is below the callbackUrlParam check because it would obscure the error
  if (!req.host) return "NEXTAUTH_URL"

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

  if (hasEmail && !options.adapter) {
    return new MissingAdapter("E-mail login requires an adapter.")
  }

  if (!twitterWarned && hasTwitterOAuth2) {
    twitterWarned = true
    return "TWITTER_OAUTH_2_BETA"
  }
}
