const nextAuthError = (errCode, ...text) => {
  if (console) {
    !text
      ? console.error(errCode)
      : console.error(`${text} \n[1mDocs: https://next-auth-docs-git-test-error-urls.iaincollins.now.sh/errors#${errCode.toLowerCase()}[22m`)
  }
}

export default nextAuthError
