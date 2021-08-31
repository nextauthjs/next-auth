/**
 * Return a JSON object with a list of all OAuth providers currently configured
 * and their signin and callback URLs. This makes it possible to automatically
 * generate buttons for all providers when rendering client side.
 * @param {import("src/lib/types").NextAuthRequest} req
 * @param {import("src/lib/types").NextAuthResponse} res
 */
export default function providers(req, res) {
  const { providers } = req.options

  const result = providers.reduce(
    (acc, { id, name, type, signinUrl, callbackUrl }) => {
      acc[id] = { id, name, type, signinUrl, callbackUrl }
      return acc
    },
    {}
  )

  res.json(result)
}
