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

export default logger
