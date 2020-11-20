const userLogger = {
  error: undefined,
  warn: undefined,
  debug: undefined
}

const logger = {
  error (code, ...text) {
    if (text && text.length <= 1) { text = text[0] || '' }
    code = code.toLowerCase()
    const link = `https://next-auth.js.org/errors#${code}`
    if (userLogger.error) {
      userLogger.error({ code, text, link })
    } else {
      console.error(
        `[next-auth][error][${code}]`,
        text,
        `\n${link}`
      )
    }
  },
  warn (code, ...text) {
    if (text && text.length <= 1) { text = text[0] || '' }
    code = code.toLowerCase()
    const link = `https://next-auth.js.org/warnings#${code}`
    if (userLogger.warn) {
      userLogger.warn({ code, text, link })
    } else {
      console.warn(
        `[next-auth][warn][${code}]`,
        text,
        `\n${link}}`
      )
    }
  },
  debug (code, ...text) {
    if (text && text.length <= 1) { text = text[0] || '' }
    code = code.toLowerCase()
    if (userLogger.debug) {
      userLogger.debug({ code, text })
    }
    if (process && process.env && process.env._NEXTAUTH_DEBUG) {
      console.log(
        `[next-auth][debug][${code}]`,
        text
      )
    }
  },
  setLogger (logger = {}) {
    if (typeof logger.error === 'function') {
      userLogger.error = logger.error
    }
    if (typeof logger.warn === 'function') {
      userLogger.warn = logger.warn
    }
    if (typeof logger.debug === 'function') {
      userLogger.debug = logger.debug
    }
  }
}

export default logger
