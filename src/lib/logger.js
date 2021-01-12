const logger = {
  error (code, message = '') {
    console.error(
      `[next-auth][error][${code.toLowerCase()}]`,
      `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}\n`,
      message
    )
  },
  warn (code, message = '') {
    console.warn(
      `[next-auth][warn][${code.toLowerCase()}]`,
      `\nhttps://next-auth.js.org/warnings#${code.toLowerCase()}\n`,
      message
    )
  },
  debug (code, message = '') {
    if (!process?.env?._NEXTAUTH_DEBUG) return
    console.log(
      `[next-auth][debug][${code.toLowerCase()}]\n`,
      message
    )
  }
}

/**
 * Override the built-in logger.
 * Any `undefined` level will use the default logger.
 * @param {Partial<Pick<Console, "log" | "warn" | "debug">>} newLogger
 */
export function setLogger (newLogger = {}) {
  if (newLogger.error) logger.error = newLogger.error
  if (newLogger.warn) logger.warn = newLogger.warn
  if (newLogger.debug) logger.debug = newLogger.debug
}

export default logger
