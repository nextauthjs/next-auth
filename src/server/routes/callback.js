// Handle callbacks from login services
import { oAuthCallback } from '../lib/oauth/callback'

export default async (req, res, options) => {
  return new Promise(resolve => {
    const { provider, providers, adapter, serverUrl } = options
    const providerConfig = providers[provider]
    const { type } = providerConfig

    const _callback = (error, user) => {
      // @TODO Check error
      if (error) {
        console.log('SIGNIN_CALLBACK_ERROR', error)
      }

      // @TODO Check if user email exists in db
      adapter.create(user)

      // Get callback URL from cookie (saved at the start of the signin flow)
      const callbackUrl = req.cookies['callback-url'] || serverUrl

      // Check callbackUrl is at allowed domain
      if (!options.checkCallbackUrl || options.checkCallbackUrl(callbackUrl)) {
        res.statusCode = 302
        res.setHeader('Location', callbackUrl)
        res.end()
      } else {
        // If checkCallbackUrl function is defined but doesn't return true,
        // then redirect to the homepage
        console.warn(`Warning: URL '${callbackUrl}' is not an allowed callback URL (redirecting client to ${serverUrl})`)
        res.statusCode = 302
        res.setHeader('Location', serverUrl)
        res.end()
      }
      return resolve()
    }

    if (type === 'oauth' || type === 'oauth2') {
      oAuthCallback(req, providerConfig, _callback)
    } else {
      res.statusCode = 500
      res.end(`Error: Callback for provider type ${type} not supported`)
      return resolve()
    }
  })
}