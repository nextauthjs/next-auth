const logger = {
  error: (errCode, ...text) => {
    if (console) {
      !text
        ? console.error(errCode)
        : console.error(
            `${text} \n[1mDocs: https://next-auth.js.org/errors#${errCode.toLowerCase()}[22m`
        )
    }
  },
  debug: (errCode, ...text) => {
    console.log(
      `${text} \n Docs: https://next-auth.js.org/errors#${errCode.toLowerCase()}`
    )
  }
}

export default logger
