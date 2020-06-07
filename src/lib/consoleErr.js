const nextAuthError = (errCode, ...text) => {
  if (console) {
    !text
      ? console.error(errCode)
      : console.error(`${text} \nDocs: https://next-auth-docs-git-test-error-urls.iaincollins.now.sh/errors#${errCode.toLowerCase()}`)
  }
}

export default nextAuthError
