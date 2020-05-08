// Returns a JSON object with a list of all outh providers currently configured
// and their signin and callback URLs. This makes it possible to automatically
// generate buttons for all providers when rendering client side.

export default (req, res, options, done) => {
  const { providers } = options

  const result = {}
  Object.entries(providers).map(([provider, providerConfig]) => {
    result[provider] = {
      name: providerConfig.name,
      signinUrl: providerConfig.signinUrl,
      callbackUrl: providerConfig.callbackUrl
    }
  })

  res.setHeader('Content-Type', 'application/json')
  res.json(result)
  return done()
}