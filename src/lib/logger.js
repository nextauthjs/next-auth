/** @type {import("types").LoggerInstance} */

import { UnknownError } from "./errors"

/** Makes sure that error is always serializable */
function formatError(o) {
  if (o instanceof Error && !(o instanceof UnknownError)) {
    return { message: o.message, stack: o.stack, name: o.name }
  }
  return o
}

const _logger = {
  error(code, metadata) {
    if (metadata.error) {
      metadata.error = formatError(metadata.error)
      metadata.message = metadata.message ?? metadata.error.message
    } else metadata = formatError(metadata)

    console.error(
      `[next-auth][error][${code.toLowerCase()}]`,
      `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`,
      metadata.message,
      metadata
    )
  },
  warn(code) {
    console.warn(
      `[next-auth][warn][${code.toLowerCase()}]`,
      `\nhttps://next-auth.js.org/warnings#${code.toLowerCase()}`
    )
  },
  debug(code, metadata) {
    if (!process?.env?._NEXTAUTH_DEBUG) return
    console.log(`[next-auth][debug][${code.toLowerCase()}]`, metadata)
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
      clientLogger[level] = (code, ...message) => {
        _logger[level](code, ...message) // Log on client as usual

        const url = `${basePath}/_log`
        const body = new URLSearchParams({
          level,
          code,
          message: JSON.stringify(
            message.map((m) => {
              if (m instanceof Error) {
                // Serializing errors: https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af
                return { name: m.name, message: m.message, stack: m.stack }
              }
              return m
            })
          ),
        })
        if (navigator.sendBeacon) {
          return navigator.sendBeacon(url, body)
        }
        return fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        })
      }
    }
    return clientLogger
  } catch {
    return _logger
  }
}
