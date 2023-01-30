/**
 *
 * This is the main entry point to the Auth.js library.
 *
 * Based on the {@link https://developer.mozilla.org/en-US/docs/Web/API/Request Request}
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Response Response} Web standard APIs.
 * Primarily used to implement [framework](https://authjs.dev/concepts/frameworks)-specific packages,
 * but it can also be used directly.
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/core
 * ```
 *
 * ## Usage
 *
 * ```ts
 * import { Auth } from "@auth/core"
 *
 * const request = new Request("https://example.com"
 * const response = await Auth(request, {...})
 *
 * console.log(response instanceof Response) // true
 * ```
 *
 * ## Resources
 *
 * - [Getting started](https://authjs.dev/getting-started/introduction)
 * - [Most common use case guides](https://authjs.dev/guides)
 *
 * @module main
 */

import { assertConfig } from "./lib/assert.js"
import { ErrorPageLoop } from "./errors.js"
import { AuthInternal, skipCSRFCheck } from "./lib/index.js"
import renderPage from "./lib/pages/index.js"
import { logger, setLogger, type LoggerInstance } from "./lib/utils/logger.js"
import { toInternalRequest, toResponse } from "./lib/web.js"

import type { Adapter } from "./adapters.js"
import type {
  CallbacksOptions,
  CookiesOptions,
  EventCallbacks,
  PagesOptions,
  SessionOptions,
  Theme,
} from "./types.js"
import type { Provider } from "./providers/index.js"
import { JWTOptions } from "./jwt.js"

export { skipCSRFCheck }

/**
 * Core functionality provided by Auth.js.
 *
 * Receives a standard {@link Request} and returns a {@link Response}.
 *
 * @example
 * ```ts
 * import Auth from "@auth/core"
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, {
 *   providers: [...],
 *   secret: "...",
 *   trustHost: true,
 * })
 *```
 * @see [Documentation](https://authjs.dev)
 */
export async function Auth(
  request: Request,
  config: AuthConfig
): Promise<Response> {
  setLogger(config.logger, config.debug)

  const internalRequest = await toInternalRequest(request)
  if (internalRequest instanceof Error) {
    logger.error(internalRequest)
    return new Response(
      `Error: This action with HTTP ${request.method} is not supported.`,
      { status: 400 }
    )
  }

  const assertionResult = assertConfig(internalRequest, config)

  if (Array.isArray(assertionResult)) {
    assertionResult.forEach(logger.warn)
  } else if (assertionResult instanceof Error) {
    // Bail out early if there's an error in the user config
    logger.error(assertionResult)
    const htmlPages = ["signin", "signout", "error", "verify-request"]
    if (
      !htmlPages.includes(internalRequest.action) ||
      internalRequest.method !== "GET"
    ) {
      return new Response(
        JSON.stringify({
          message:
            "There was a problem with the server configuration. Check the server logs for more information.",
          code: assertionResult.name,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const { pages, theme } = config

    const authOnErrorPage =
      pages?.error &&
      internalRequest.url.searchParams
        .get("callbackUrl")
        ?.startsWith(pages.error)

    if (!pages?.error || authOnErrorPage) {
      if (authOnErrorPage) {
        logger.error(
          new ErrorPageLoop(
            `The error page ${pages?.error} should not require authentication`
          )
        )
      }
      const render = renderPage({ theme })
      const page = render.error({ error: "Configuration" })
      return toResponse(page)
    }

    return Response.redirect(`${pages.error}?error=Configuration`)
  }

  const internalResponse = await AuthInternal(internalRequest, config)

  const response = await toResponse(internalResponse)

  // If the request expects a return URL, send it as JSON
  // instead of doing an actual redirect.
  const redirect = response.headers.get("Location")
  if (request.headers.has("X-Auth-Return-Redirect") && redirect) {
    response.headers.delete("Location")
    response.headers.set("Content-Type", "application/json")
    return new Response(JSON.stringify({ url: redirect }), {
      headers: response.headers,
    })
  }
  return response
}

/**
 * Configure the {@link Auth} method.
 *
 * @example
 * ```ts
 * import Auth, { type AuthConfig } from "@auth/core"
 *
 * export const authConfig: AuthConfig = {...}
 *
 * const request = new Request("https://example.com")
 * const response = await AuthHandler(request, authConfig)
 * ```
 *
 * @see [Initiailzation](https://authjs.dev/reference/configuration/auth-options)
 */
export interface AuthConfig {
  /**
   * List of authentication providers for signing in
   * (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order.
   * This can be one of the built-in providers or an object with a custom provider.
   *
   * @default []
   */
  providers: Provider[]
  /**
   * A random string used to hash tokens, sign cookies and generate cryptographic keys.
   * If not specified, it falls back to `AUTH_SECRET` or `NEXTAUTH_SECRET` from environment variables.
   * To generate a random string, you can use the following command:
   *
   * On Unix systems: `openssl rand -hex 32`
   * Or go to https://generate-secret.vercel.app/32
   */
  secret?: string
  /**
   * Configure your session like if you want to use JWT or a database,
   * how long until an idle session expires, or to throttle write operations in case you are using a database.
   */
  session?: Partial<SessionOptions>
  /**
   * JSON Web Tokens are enabled by default if you have not specified an {@link AuthConfig.adapter}.
   * JSON Web Tokens are encrypted (JWE) by default. We recommend you keep this behaviour.
   */
  jwt?: Partial<JWTOptions>
  /**
   * Specify URLs to be used if you want to create custom sign in, sign out and error pages.
   * Pages specified will override the corresponding built-in page.
   *
   * @default {}
   * @example
   *
   * ```ts
   *   pages: {
   *     signIn: '/auth/signin',
   *     signOut: '/auth/signout',
   *     error: '/auth/error',
   *     verifyRequest: '/auth/verify-request',
   *     newUser: '/auth/new-user'
   *   }
   * ```
   */
  pages?: Partial<PagesOptions>
  /**
   * Callbacks are asynchronous functions you can use to control what happens when an action is performed.
   * Callbacks are *extremely powerful*, especially in scenarios involving JSON Web Tokens
   * as they **allow you to implement access controls without a database** and to **integrate with external databases or APIs**.
   */
  callbacks?: Partial<CallbacksOptions>
  /**
   * Events are asynchronous functions that do not return a response, they are useful for audit logging.
   * You can specify a handler for any of these events below - e.g. for debugging or to create an audit log.
   * The content of the message object varies depending on the flow
   * (e.g. OAuth or Email authentication flow, JWT or database sessions, etc),
   * but typically contains a user object and/or contents of the JSON Web Token
   * and other information relevant to the event.
   *
   * @default {}
   */
  events?: Partial<EventCallbacks>
  /** You can use the adapter option to pass in your database adapter. */
  adapter?: Adapter
  /**
   * Set debug to true to enable debug messages for authentication and database operations.
   *
   * - ⚠ If you added a custom {@link AuthConfig.logger}, this setting is ignored.
   *
   * @default false
   */
  debug?: boolean
  /**
   * Override any of the logger levels (`undefined` levels will use the built-in logger),
   * and intercept logs in NextAuth. You can use this option to send NextAuth logs to a third-party logging service.
   *
   * @example
   *
   * ```ts
   * // /pages/api/auth/[...nextauth].js
   * import log from "logging-service"
   * export default NextAuth({
   *   logger: {
   *     error(code, ...message) {
   *       log.error(code, message)
   *     },
   *     warn(code, ...message) {
   *       log.warn(code, message)
   *     },
   *     debug(code, ...message) {
   *       log.debug(code, message)
   *     }
   *   }
   * })
   * ```
   *
   * - ⚠ When set, the {@link AuthConfig.debug} option is ignored
   *
   * @default console
   */
  logger?: Partial<LoggerInstance>
  /** Changes the theme of built-in {@link AuthConfig.pages}. */
  theme?: Theme
  /**
   * When set to `true` then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.
   * This option defaults to `false` on URLs that start with `http://` (e.g. http://localhost:3000) for developer convenience.
   * You can manually set this option to `false` to disable this security feature and allow cookies
   * to be accessible from non-secured URLs (this is not recommended).
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * The default is `false` HTTP and `true` for HTTPS sites.
   */
  useSecureCookies?: boolean
  /**
   * You can override the default cookie names and options for any of the cookies used by NextAuth.js.
   * You can specify one or more cookies with custom properties,
   * but if you specify custom options for a cookie you must provide all the options for that cookie.
   * If you use this feature, you will likely want to create conditional behavior
   * to support setting different cookies policies in development and production builds,
   * as you will be opting out of the built-in dynamic policy.
   *
   * - ⚠ **This is an advanced option.** Advanced options are passed the same way as basic options,
   * but **may have complex implications** or side effects.
   * You should **try to avoid using advanced options** unless you are very comfortable using them.
   *
   * @default {}
   */
  cookies?: Partial<CookiesOptions>
  /** @todo */
  trustHost?: boolean
  skipCSRFCheck?: typeof skipCSRFCheck
}
