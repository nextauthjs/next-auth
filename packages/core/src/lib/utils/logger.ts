import { AuthError } from "../../errors.js"
import type { AuthConfig } from "../../index.js"

export type WarningCode =
  | "debug-enabled"
  | "csrf-disabled"
  | "experimental-webauthn"
  | "env-url-basepath-redundant"
  | "env-url-basepath-mismatch"

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
 * Any `undefined` level will use the default.
 */
export function setLogger(
  config: Pick<AuthConfig, "logger" | "debug" | "logLevel">
): LoggerInstance {
  const newLogger: LoggerInstance = { error() {}, warn() {}, debug() {} }

  let { debug, logLevel = "silent", logger } = config
  if (debug) logLevel = "verbose"

  const levels = ["error", "warn", "debug"]
  const levelIndex = levels.indexOf(logLevel)

  for (const level of levels) {
    if (levels.indexOf(level) <= levelIndex) {
      newLogger[level] = defaultLogger[level]
    }
  }

  // User preference overrides default logger
  if (logger?.error) newLogger.error = logger.error
  if (logger?.warn) newLogger.warn = logger.warn
  if (logger?.debug) newLogger.debug = logger.debug
  logger ??= newLogger

  return newLogger
}
