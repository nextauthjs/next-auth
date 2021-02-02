const logger = {
  error (code, ...message) {
    console.error(
      `[next-auth][error][${code.toLowerCase()}]`,
      `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`,
      ...message
    )
  },
  warn (code, ...message) {
    console.warn(
      `[next-auth][warn][${code.toLowerCase()}]`,
      `\nhttps://next-auth.js.org/warnings#${code.toLowerCase()}`,
      ...message
    )
  },
  debug (code, ...message) {
    if (!process?.env?._NEXTAUTH_DEBUG) return
    console.log(
      `[next-auth][debug][${code.toLowerCase()}]`,
      ...message
    )
  }
}

export default logger
