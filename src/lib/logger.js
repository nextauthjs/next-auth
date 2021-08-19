import { UnknownError } from "./errors"

/** Makes sure that error is always serializable */
function formatError(o) {
  if (o instanceof Error && !(o instanceof UnknownError)) {
    return { message: o.message, stack: o.stack, name: o.name }
  }
  if (o?.error) {
    o.error = formatError(o.error)
    o.message = o.message ?? o.error.message
  }
  return o
}

/** @type {import("types").LoggerInstance} */
const _logger = {
  error(code, metadata) {
    metadata = formatError(metadata)
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
    if (!process?.env?._NEXTAUTH_DEBUG) return
    console.log(`[next-auth][debug][${code}]`, metadata)
  },
}

/**
 * Override the built-in logger.
 * Any `undefined` level will use the default logger.
 * @param {Partial<import("types").LoggerInstance>} newLogger
 */
export function setLogger(newLogger = {}) {
  if (newLogger.error) _logger.error = newLogger.error
  if (newLogger.warn) _logger.warn = newLogger.warn
  if (newLogger.debug) _logger.debug = newLogger.debug
}

export default _logger

/**
 * Serializes client-side log messages and sends them to the server
 * @param {import("types").LoggerInstance} logger
 * @param {string} basePath
 * @return {import("types").LoggerInstance}
 */
export function proxyLogger(logger = _logger, basePath) {
  try {
    if (typeof window === "undefined") {
      return logger
    }

    const clientLogger = {}
    for (const level in logger) {
      clientLogger[level] = (code, metadata) => {
        _logger[level](code, metadata) // Logs to console

        if (level === "error") {
          metadata = formatError(metadata)
        }
        metadata.client = true
        const url = `${basePath}/_log`
        const body = new URLSearchParams({ level, code, ...metadata })
        if (navigator.sendBeacon) {
          return navigator.sendBeacon(url, body)
        }
        return fetch(url, { method: "POST", body, keepalive: true })
      }
    }
    return clientLogger
  } catch {
    return _logger
  }
}
