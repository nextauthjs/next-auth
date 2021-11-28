import { UnknownError } from "../core/errors"

// TODO: better typing
/** Makes sure that error is always serializable */
function formatError(o: unknown): unknown {
  if (o instanceof Error && !(o instanceof UnknownError)) {
    return { message: o.message, stack: o.stack, name: o.name }
  }
  if (hasErrorProperty(o)) {
    o.error = formatError(o.error) as Error
    o.message = o.message ?? o.error.message
  }
  return o
}

function hasErrorProperty(
  x: unknown
): x is { error: Error; [key: string]: unknown } {
  return !!(x as any)?.error
}

export type WarningCode = "NEXTAUTH_URL" | "NO_SECRET"

/**
 * Override any of the methods, and the rest will use the default logger.
 *
 * [Documentation](https://next-auth.js.org/configuration/options#logger)
 */
export interface LoggerInstance extends Record<string, Function> {
  warn: (code: WarningCode) => void
  error: (
    code: string,
    /**
     * Either an instance of (JSON serializable) Error
     * or an object that contains some debug information.
     * (Error is still available through `metadata.error`)
     */
    metadata: Error | { error: Error; [key: string]: unknown }
  ) => void
  debug: (code: string, metadata: unknown) => void
}

const _logger: LoggerInstance = {
  error(code, metadata) {
    metadata = formatError(metadata) as Error
    console.error(
      `[next-auth][error][${code}]`,
      `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`,
      metadata.message,
      metadata
    )
  },
  warn(code) {
    console.warn(
      `[next-auth][warn][${code}]`,
      `\nhttps://next-auth.js.org/warnings#${code.toLowerCase()}`
    )
  },
  debug(code, metadata) {
    console.log(`[next-auth][debug][${code}]`, metadata)
  },
}

/**
 * Override the built-in logger with user's implementation.
 * Any `undefined` level will use the default logger.
 */
export function setLogger(
  newLogger: Partial<LoggerInstance> = {},
  debug?: boolean
) {
  // Turn off debug logging if `debug` isn't set to `true`
  if (!debug) _logger.debug = () => {}

  if (newLogger.error) _logger.error = newLogger.error
  if (newLogger.warn) _logger.warn = newLogger.warn
  if (newLogger.debug) _logger.debug = newLogger.debug
}

export default _logger

/** Serializes client-side log messages and sends them to the server */
export function proxyLogger(
  logger: LoggerInstance = _logger,
  basePath?: string
): LoggerInstance {
  try {
    if (typeof window === "undefined") {
      return logger
    }

    const clientLogger: Record<string, unknown> = {}
    for (const level in logger) {
      clientLogger[level] = (code: string, metadata: Error) => {
        _logger[level](code, metadata) // Logs to console

        if (level === "error") {
          metadata = formatError(metadata) as Error
        }
        ;(metadata as any).client = true
        const url = `${basePath}/_log`
        const body = new URLSearchParams({ level, code, ...metadata })
        if (navigator.sendBeacon) {
          return navigator.sendBeacon(url, body)
        }
        return fetch(url, { method: "POST", body, keepalive: true })
      }
    }
    return clientLogger as unknown as LoggerInstance
  } catch {
    return _logger
  }
}
