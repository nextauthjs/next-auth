import { AuthError } from "../../errors.js"
import type { AuthConfig } from "../../index.js"

/**
 * - `debug-enabled`: The `debug` option was evaluated to `true`. It adds extra logs in the terminal which is useful in development,
 *   but since it can print sensitive information about users, make sure to set this to `false` in production.
 *   In Node.js environments, you can for example set `debug: process.env.NODE_ENV !== "production"`.
 *   Consult with your runtime/framework on how to set this value correctly.
 * - `csrf-disabled`: You were trying to get a CSRF response from Auth.js (eg.: by calling a `/csrf` endpoint),
 *   but in this setup, CSRF protection via Auth.js was turned off. This is likely if you are not directly using `@auth/core`
 *   but a framework library (like `@auth/sveltekit`) that already has CSRF protection built-in. You likely won't need the CSRF response.
 * - `env-url-basepath-redundant`: `AUTH_URL` (or `NEXTAUTH_URL`) and `authConfig.basePath` are both declared. This is a configuration mistake - you should either remove the `authConfig.basePath` configuration,
 *   or remove the `pathname` of `AUTH_URL` (or `NEXTAUTH_URL`). Only one of them is needed.
 * - `env-url-basepath-mismatch`: `AUTH_URL` (or `NEXTAUTH_URL`) and `authConfig.basePath` are both declared, but they don't match. This is a configuration mistake.
 *   `@auth/core` will use `basePath` to construct the full URL to the corresponding action (/signin, /signout, etc.) in this case.
 * - `experimental-webauthn`: Experimental WebAuthn feature is enabled.
 */
export type WarningCode =
  | "debug-enabled"
  | "csrf-disabled"
  | "env-url-basepath-redundant"
  | "env-url-basepath-mismatch"
  | "experimental-webauthn"

/**
 * Override any of the methods, and the rest will use the default logger.
 *
 * [Documentation](https://authjs.dev/reference/core#authconfig#logger)
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface LoggerInstance extends Record<string, Function> {
  warn: (code: WarningCode) => void
  error: (error: Error) => void
  debug: (message: string, metadata?: unknown) => void
}

const red = "\x1b[31m"
const yellow = "\x1b[33m"
const grey = "\x1b[90m"
const reset = "\x1b[0m"

const defaultLogger: LoggerInstance = {
  error(error) {
    const name = error instanceof AuthError ? error.type : error.name
    console.error(`${red}[auth][error]${reset} ${name}: ${error.message}`)
    if (
      error.cause &&
      typeof error.cause === "object" &&
      "err" in error.cause &&
      error.cause.err instanceof Error
    ) {
      const { err, ...data } = error.cause
      console.error(`${red}[auth][cause]${reset}:`, err.stack)
      if (data)
        console.error(
          `${red}[auth][details]${reset}:`,
          JSON.stringify(data, null, 2)
        )
    } else if (error.stack) {
      console.error(error.stack.replace(/.*/, "").substring(1))
    }
  },
  warn(code) {
    const url = `https://warnings.authjs.dev#${code}`
    console.warn(`${yellow}[auth][warn][${code}]${reset}`, `Read more: ${url}`)
  },
  debug(message, metadata) {
    console.log(
      `${grey}[auth][debug]:${reset} ${message}`,
      JSON.stringify(metadata, null, 2)
    )
  },
}

/**
 * Override the built-in logger with user's implementation.
 * Any `undefined` level will use the default logger.
 */
export function setLogger(
  config: Pick<AuthConfig, "logger" | "debug">
): LoggerInstance {
  const newLogger: LoggerInstance = {
    ...defaultLogger,
  }

  // Turn off debug logging if `debug` isn't set to `true`
  if (!config.debug) newLogger.debug = () => {}

  if (config.logger?.error) newLogger.error = config.logger.error
  if (config.logger?.warn) newLogger.warn = config.logger.warn
  if (config.logger?.debug) newLogger.debug = config.logger.debug

  config.logger ??= newLogger
  return newLogger
}
