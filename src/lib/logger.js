const logger = {
  error: (errorCode, ...text) => {
    if (console) {
      !text
        ? console.error(errorCode)
        : console.error(
          `[next-auth][error][${errorCode.toLowerCase()}]`,
          text,
          `\nhttps://next-auth.js.org/errors#${errorCode.toLowerCase()}`
        )
    }
  },
  warn: (warnCode, ...text) => {
    if (console) {
      !text
        ? console.warn(warnCode)
        : console.warn(
          `[next-auth][warn][${warnCode.toLowerCase()}]`,
          text
        )
    }
  },
  debug: (debugCode, ...text) => {
    if (process && process.env && process.env._NEXTAUTH_DEBUG) {
      console.log(
        `[next-auth][debug][${debugCode.toLowerCase()}]`,
        text
      )
    }
  }
}

export default logger
