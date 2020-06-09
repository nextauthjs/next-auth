const logger = {
  error: (errorCode, ...text) => {
    if (console) {
      !text
        ? console.error(errorCode)
        : console.error(
            `[next-auth][error][${errorCode}]`,
            text,
            `\nhttps://next-auth.js.org/errors#${errorCode.toLowerCase()}`
        )
    }
  },
  debug: (debugCode, ...text) => {
    console.log(
      `[next-auth][debug][${debugCode}]`,
      text
    )
  }
}

export default logger
