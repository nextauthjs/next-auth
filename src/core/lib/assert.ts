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

  if (!req.query?.nextauth) {
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

  options.providers.forEach(({ type }) => {
    if (type === "credentials") hasCredentials = true
    else if (type === "email") hasEmail = true
  })

  if (hasCredentials) {
    if (options.session?.strategy === "database" || options.adapter) {
      return new UnsupportedStrategy(
        "Signin in with credentials only supported if JWT strategy is enabled"
      )
    }
    if (
      options.providers.every((p) => p.type !== "credentials" || p.authorize)
    ) {
      return new MissingAuthorize(
        "Must define an authorize() handler to use credentials authentication provider"
      )
    }
  }

  if (!options.adapter && hasEmail) {
    return new MissingAdapter("E-mail login requires an adapter.")
  }
}
