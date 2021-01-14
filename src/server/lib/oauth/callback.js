import { createHash } from 'crypto'
import getOAuthClientLegacy from './client.legacy'
import getOAuthClient from './client'
import logger from '../../../lib/logger'
import { OAuthCallbackHandlerError } from '../../../lib/errors'

/**
 * Handles exchange of the authorization code
 * for OAuth tokens, fetches the profile data
 * from the /userinfo endpoint
 * @docs https://tools.ietf.org/html/rfc6749#section-4.1.3
 * @docs https://www.oauth.com/oauth2-servers/signing-in-with-google/verifying-the-user-info/
 *
 * @param {import('../../index').NextApiRequestWithOptions} req
 * @returns {Promise<import('./callback').HandleOAuthCallbackResultObject>}
 */
export default async function handleOAuthCallback (req) {
  const { body, options: { provider, csrfToken, secret } } = req
  try {
    if (body?.error) throw body.error
    if (provider.version?.startsWith('2.')) {
      const client = getOAuthClient(provider)

      const params = client.callbackParams(req)

      /** @type {import("openid-client").OAuthCallbackChecks} */
      const checks = {
        response_type: 'code'
      }

      if (provider.verifications?.includes('pkce')) {
        checks.code_verifier = secret
      }
      if (provider.verifications?.includes('state')) {
        checks.state = createHash('sha256').update(csrfToken).digest('hex')
      }

      const tokens = await client.oauthCallback(provider.callbackUrl, params, checks)
      const profile = await client.userinfo(tokens.access_token)

      // The "user" object is specific to the Apple provider and is provided on first sign in
      // e.g. {"name":{"firstName":"Johnny","lastName":"Appleseed"},"email":"johnny.appleseed@nextauth.com"}
      const user = JSON.parse(body?.user ?? null) ?? req.query.user
      if (user) {
        profile.user = user
      }

      const result = {
        profile: provider.profile(profile),
        account: {
          provider: provider.id,
          type: provider.type,
          // REVIEW: Why provider AND id?
          id: provider.id,
          ...tokens
        },
        OAuthProfile: profile
      }

      return result
    }

    // Handle OAuth v1.x
    const client = getOAuthClientLegacy(provider)
    const { oauth_token: oauthToken, oauth_verifier: oauthVerifier } = req.query
    const { accessToken, refreshToken } = await client.getOAuthAccessToken(oauthToken, null, oauthVerifier)

    return client.getProfile({ tokens: { accessToken, refreshToken }, provider })
  } catch (error) {
    logger.error('OAUTH_CALLBACK_HANDLER_ERROR', error)
    throw new OAuthCallbackHandlerError('OAuth callback handler failed')
  }
}
