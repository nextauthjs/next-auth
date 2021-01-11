const logger = {
  error (code, ...text) {
    console.error(
      `[next-auth][error][${code.toLowerCase()}]`,
      JSON.stringify(text),
      `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`
    )
  },
  warn (code, ...text) {
    console.warn(
      `[next-auth][warn][${code.toLowerCase()}]`,
      JSON.stringify(text),
      `\nhttps://next-auth.js.org/warnings#${code.toLowerCase()}`
    )
  },
  debug (code, ...text) {
    if (!process?.env?._NEXTAUTH_DEBUG) return
    console.log(
      `[next-auth][debug][${code.toLowerCase()}]`,
      JSON.stringify(text)
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
