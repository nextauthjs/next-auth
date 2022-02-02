import {
  MissingAdapter,
  MissingAPIRoute,
  MissingAuthorize,
  MissingSecret,
  UnsupportedStrategy,
} from "../errors"

import type { NextAuthHandlerParams } from ".."
import type { WarningCode } from "../../lib/logger"

type ConfigError =
  | MissingAPIRoute
  | MissingSecret
  | UnsupportedStrategy
  | MissingAuthorize
  | MissingAdapter

let twitterWarned = false

/**
 * Verify that the user configured `next-auth` correctly.
 * Good place to mention deprecations as well.
 *
 * REVIEW: Make some of these and corresponding docs less Next.js specific?
 */
export function assertConfig(
  params: NextAuthHandlerParams
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

  if (!req.host) return "NEXTAUTH_URL"

  let hasCredentials, hasEmail
  let hasTwitterProvider

  for (const provider of options.providers) {
    if (provider.type === "credentials") hasCredentials = true
    else if (provider.type === "email") hasEmail = true
    else if (provider.id === "twitter") hasTwitterProvider = true
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

  if (!twitterWarned && hasTwitterProvider) {
    twitterWarned = true
    return "TWITTER_OAUTH_2_BETA"
  }
}
