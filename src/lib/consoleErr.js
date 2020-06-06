export default (function () {
  if (console) {
    const cx = console.error
    console.error = (errCode, text) => {
      !text
        ? cx(errCode)
        : cx(`${text}\nDocs: https://next-auth-docs-git-test-error-urls.iaincollins.now.sh/errors#${errCode}`)
    }
  }
})()
