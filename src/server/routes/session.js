// Returns a JSON object with current session object
export default (req, res, options, resolve) => {
  const { providers, urlPrefix } = options
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({
    session: false
  }))
  return resolve()
}