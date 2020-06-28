import {NextApiRequest, NextApiResponse} from "next";

// Return a JSON object with a list of all outh providers currently configured
// and their signin and callback URLs. This makes it possible to automatically
// generate buttons for all providers when rendering client side.
export default (
  _req: NextApiRequest,
  res: NextApiResponse,
  // TODO: normalized options type
  options: any,
  done: (typeof Promise)["resolve"],
) => {
  const { providers } = options

  const result = {}
  Object.entries(providers).map(([provider, providerConfig]) => {
    result[provider] = {
      id: provider,
      name: providerConfig.name,
      type: providerConfig.type,
      signinUrl: providerConfig.signinUrl,
      callbackUrl: providerConfig.callbackUrl
    }
  })

  res.setHeader('Content-Type', 'application/json')
  res.json(result)
  return done()
}
