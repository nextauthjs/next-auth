/**
 * Return a JSON object with a list of all outh providers currently configured
 * and their signin and callback URLs. This makes it possible to automatically
 * generate buttons for all providers when rendering client side.
 */
export default function providers (req, res) {
  const { providers } = req.options

  const result = Object.entries(providers)
    .reduce((acc, [provider, providerConfig]) => ({
      ...acc,
      [provider]: {
        id: provider,
        name: providerConfig.name,
        type: providerConfig.type,
        signinUrl: providerConfig.signinUrl,
        callbackUrl: providerConfig.callbackUrl
      }
    }), {})

  res.setHeader('Content-Type', 'application/json')
  res.json(result)
  return res.end()
}
