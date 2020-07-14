const logger = {
  error: (errorCode, ...text) => {
    if (!console) { return }
    if (text && text.length <= 1) { text = text[0] || '' }
    console.error(
      `[next-auth][error][${errorCode.toLowerCase()}]`,
      text,
      `\nhttps://next-auth.js.org/errors#${errorCode.toLowerCase()}`
    )
  },
  warn: (warnCode, ...text) => {
    if (!console) { return }
    if (text && text.length <= 1) { text = text[0] || '' }
    console.warn(
      `[next-auth][warn][${warnCode.toLowerCase()}]`,
      text,
      `\nhttps://next-auth.js.org/warning#${warnCode.toLowerCase()}`
    )
  },
  debug: (debugCode, ...text) => {
    if (!console) { return }
    if (text && text.length <= 1) { text = text[0] || '' }
    if (process && process.env && process.env._NEXTAUTH_DEBUG) {
      console.log(
        `[next-auth][debug][${debugCode.toLowerCase()}]`,
        text
      )
    }
  }
}

export default logger
