import { createHash } from 'crypto'
import { decode as jwtDecode } from 'jsonwebtoken'
import oAuthClient from './client'
import logger from '../../../lib/logger'
class OAuthCallbackError extends Error {
  constructor (message) {
    super(message)
    this.name = 'OAuthCallbackError'
    this.message = message
  }
}

export default async function oAuthCallback (req) {
  const { provider, csrfToken } = req.options
  const client = oAuthClient(provider)

  if (provider.version?.startsWith('2.')) {
    // The "user" object is specific to the Apple provider and is provided on first sign in
    // e.g. {"name":{"firstName":"Johnny","lastName":"Appleseed"},"email":"johnny.appleseed@nextauth.com"}
    let { code, user, state } = req.query // eslint-disable-line camelcase
    // For OAuth 2.0 flows, check state returned and matches expected value
    // (a hash of the NextAuth.js CSRF token).
    //
    // Apple does not support state verification.
    if (provider.id !== 'apple') {
      const expectedState = createHash('sha256').update(csrfToken).digest('hex')
      if (state !== expectedState) {
        throw new OAuthCallbackError('Invalid state returned from OAuth provider')
      }
    }

    if (req.method === 'POST') {
      try {
        const body = JSON.parse(JSON.stringify(req.body))
        if (body.error) {
          throw new Error(body.error)
        }

        code = body.code
        user = body.user != null ? JSON.parse(body.user) : null
      } catch (error) {
        logger.error('OAUTH_CALLBACK_HANDLER_ERROR', error, req.body, provider.id, code)
        throw error
      }
    }

    // REVIEW: Is this used by any of the providers?
    // Pass authToken in header by default (unless 'useAuthTokenHeader: false' is set)
    if (Object.prototype.hasOwnProperty.call(provider, 'useAuthTokenHeader')) {
      client.useAuthorizationHeaderforGET(provider.useAuthTokenHeader)
    } else {
      client.useAuthorizationHeaderforGET(true)
    }

    try {
      const { accessToken, refreshToken, results } = await client.getOAuthAccessToken(code, provider)
      const tokens = { accessToken, refreshToken, idToken: results.id_token }
      let profileData
      if (provider.idToken) {
        // If we don't have an ID Token most likely the user hit a cancel
        // button when signing in (or the provider is misconfigured).
        //
        // Unfortunately, we can't tell which, so we can't treat it as an
        // error, so instead we just returning nothing, which will cause the
        // user to be redirected back to the sign in page.
        if (!results?.id_token) {
          throw new OAuthCallbackError()
        }

        // Support services that use OpenID ID Tokens to encode profile data
        profileData = decodeIdToken(results.id_token)
      } else {
        profileData = await client.get(provider, accessToken, results)
      }

      return _getProfile({ profileData, provider, tokens, user })
    } catch (error) {
      logger.error('OAUTH_GET_ACCESS_TOKEN_ERROR', error, provider.id, code)
      throw error
    }
  }

  try {
    // Handle OAuth v1.x
    const {
      oauth_token: oauthToken, oauth_verifier: oauthVerifier
    } = req.query
    const { accessToken, refreshToken, results } = await client.getOAuthAccessToken(oauthToken, null, oauthVerifier)
    const profileData = await client.get(
      provider.profileUrl,
      accessToken,
      refreshToken
    )

    const tokens = {
      accessToken, refreshToken, idToken: results.id_token
    }

    return _getProfile({
      profileData, tokens, provider
    })
  } catch (error) {
    logger.error('OAUTH_V1_GET_ACCESS_TOKEN_ERROR', error)
    throw error
  }
}

/**
 * //6/30/2020 @geraldnolan added userData parameter to attach additional data to the profileData object
 * Returns profile, raw profile and auth provider details
 */
async function _getProfile ({
  profileData, tokens: { accessToken, refreshToken, idToken }, provider, user
}) {
  try {
    // Convert profileData into an object if it's a string
    if (typeof profileData === 'string' || profileData instanceof String) {
      profileData = JSON.parse(profileData)
    }

    // If a user object is supplied (e.g. Apple provider) add it to the profile object
    if (user != null) {
      profileData.user = user
    }

    profileData.idToken = idToken

    logger.debug('PROFILE_DATA', profileData)

    const profile = await provider.profile(profileData)
    // Return profile, raw profile and auth provider details
    return {
      profile: {
        ...profile,
        email: profile.email?.toLowerCase() ?? null
      },
      account: {
        provider: provider.id,
        type: provider.type,
        id: profile.id,
        refreshToken,
        accessToken,
        accessTokenExpires: null
      },
      OAuthProfile: profileData
    }
  } catch (exception) {
    // If we didn't get a response either there was a problem with the provider
    // response *or* the user cancelled the action with the provider.
    //
    // Unfortuately, we can't tell which - at least not in a way that works for
    // all providers, so we return an empty object; the user should then be
    // redirected back to the sign up page. We log the error to help developers
    // who might be trying to debug this when configuring a new provider.
    logger.error('OAUTH_PARSE_PROFILE_ERROR', exception, profileData)
    return {
      profile: null,
      account: null,
      OAuthProfile: profileData
    }
  }
}

function decodeIdToken (idToken) {
  if (!idToken) {
    throw new OAuthCallbackError('Missing JWT ID Token')
  }
  return jwtDecode(idToken, { json: true })
}
