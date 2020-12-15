import { createHash } from 'crypto'
import querystring from 'querystring'
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

/**
 * @TODO Refactor monkey patching in _getOAuthAccessToken() and _get()
 * These methods have been forked from `node-oauth` to fix bugs; it may make
 * sense to migrate all the methods we need from node-oauth to nexth-auth (with
 * appropriate credit) to make it easier to maintain and address issues as they
 * come up, as the node-oauth package does not seem to be actively maintained.

 * @TODO Refactor to use promises and not callbacks
 */
export default async function oAuthCallback (req, provider, csrfToken) {
  // The "user" object is specific to the Apple provider and is provided on first sign in
  // e.g. {"name":{"firstName":"Johnny","lastName":"Appleseed"},"email":"johnny.appleseed@nextauth.com"}
  let { oauth_token, oauth_verifier, code, user, state } = req.query // eslint-disable-line camelcase
  const client = oAuthClient(provider)

  if (provider.version?.startsWith('2.')) {
    // For OAuth 2.0 flows, check state returned and matches expected value
    // (a hash of the NextAuth.js CSRF token).
    //
    // This check can be disabled for providers that do not support it by
    // setting `state: false` as a option on the provider (defaults to true).
    if (!Object.prototype.hasOwnProperty.call(provider, 'state') || provider.state === true) {
      const expectedState = createHash('sha256').update(csrfToken).digest('hex')
      if (state !== expectedState) {
        throw new OAuthCallbackError('Invalid state returned from OAuth provider')
      }
    }

    if (req.method === 'POST') {
      try {
        const body = JSON.parse(JSON.stringify(req.body))
        if (body.error) { throw new Error(body.error) }

        code = body.code
        user = body.user != null ? JSON.parse(body.user) : null
      } catch (e) {
        logger.error('OAUTH_CALLBACK_HANDLER_ERROR', e, req.body, provider.id, code)
        throw new OAuthCallbackError()
      }
    }

    // Pass authToken in header by default (unless 'useAuthTokenHeader: false' is set)
    if (Object.prototype.hasOwnProperty.call(provider, 'useAuthTokenHeader')) {
      client.useAuthorizationHeaderforGET(provider.useAuthTokenHeader)
    } else {
      client.useAuthorizationHeaderforGET(true)
    }

    // Use custom getOAuthAccessToken() method for oAuth2 flows
    client.getOAuthAccessToken = _getOAuthAccessToken

    await client.getOAuthAccessToken(
      code,
      provider,
      async (error, accessToken, refreshToken, results) => {
        if (error || results.error) {
          logger.error('OAUTH_GET_ACCESS_TOKEN_ERROR', error, results, provider.id, code)
          throw new OAuthCallbackError(error || results.error)
        }

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
          const profileData = decodeIdToken(results.id_token)

          return _getProfile(error, profileData, accessToken, refreshToken, provider, user)
        } else {
          // Use custom get() method for oAuth2 flows
          client.get = _get

          let result
          client.get(
            provider,
            accessToken,
            results,
            async (error, profileData) => {
              result = await _getProfile(error, profileData, accessToken, refreshToken, provider)
            }
          )
          return result
        }
      }
    )
  } else {
    // Handle OAuth v1.x
    await client.getOAuthAccessToken(
      oauth_token,
      null,
      oauth_verifier,
      (error, accessToken, refreshToken, results) => {
        // @TODO Handle error
        if (error || results.error) {
          logger.error('OAUTH_V1_GET_ACCESS_TOKEN_ERROR', error, results)
        }

        let result
        client.get(
          provider.profileUrl,
          accessToken,
          refreshToken,
          async (error, profileData) => {
            result = await _getProfile(error, profileData, accessToken, refreshToken, provider)
          }
        )
        return result
      }
    )
  }
}

/**
 * //6/30/2020 @geraldnolan added userData parameter to attach additional data to the profileData object
 * Returns profile, raw profile and auth provider details
 */
async function _getProfile (error, profileData, accessToken, refreshToken, provider, userData) {
  if (error) {
    logger.error('OAUTH_GET_PROFILE_ERROR', error)
    throw new OAuthCallbackError(error)
  }

  try {
    // Convert profileData into an object if it's a string
    if (typeof profileData === 'string' || profileData instanceof String) {
      profileData = JSON.parse(profileData)
    }

    // If a user object is supplied (e.g. Apple provider) add it to the profile object
    if (userData != null) {
      profileData.user = userData
    }

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

// Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
async function _getOAuthAccessToken (code, provider, callback) {
  const url = provider.accessTokenUrl
  const setGetAccessTokenAuthHeader = (provider.setGetAccessTokenAuthHeader !== null) ? provider.setGetAccessTokenAuthHeader : true
  const params = { ...provider.params } || {}
  const headers = { ...provider.headers } || {}
  const codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code'

  if (!params[codeParam]) { params[codeParam] = code }

  if (!params.client_id) { params.client_id = provider.clientId }

  if (!params.client_secret) {
    // For some providers it useful to be able to generate the secret on the fly
    // e.g. For Sign in With Apple a JWT token using the properties in clientSecret
    if (provider.clientSecretCallback) {
      params.client_secret = await provider.clientSecretCallback(provider.clientSecret)
    } else {
      params.client_secret = provider.clientSecret
    }
  }

  if (!params.redirect_uri) { params.redirect_uri = provider.callbackUrl }

  if (!headers['Content-Type']) { headers['Content-Type'] = 'application/x-www-form-urlencoded' }
  // Added as a fix to accomodate change in Twitch OAuth API
  if (!headers['Client-ID']) { headers['Client-ID'] = provider.clientId }
  // Added as a fix for Reddit Authentication
  if (provider.id === 'reddit') {
    headers.Authorization = 'Basic ' + Buffer.from((provider.clientId + ':' + provider.clientSecret)).toString('base64')
  }
  // Okta errors when this is set. Maybe there are other Providers that also wont like this.
  if (setGetAccessTokenAuthHeader) {
    if (!headers.Authorization) { headers.Authorization = `Bearer ${code}` }
  }

  const postData = querystring.stringify(params)

  this._request(
    'POST',
    url,
    headers,
    postData,
    null,
    (error, data, response) => {
      if (error) {
        logger.error('OAUTH_GET_ACCESS_TOKEN_ERROR', error, data, response)
        return callback(error)
      }

      let results
      try {
        // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
        // responses should be in JSON
        results = JSON.parse(data)
      } catch (e) {
        // However both Facebook + Github currently use rev05 of the spec  and neither
        // seem to specify a content-type correctly in their response headers. :(
        // Clients of these services suffer a minor performance cost.
        results = querystring.parse(data)
      }
      const accessToken = provider.accessTokenGetter ? provider.accessTokenGetter(results) : results.access_token
      const refreshToken = results.refresh_token
      callback(null, accessToken, refreshToken, results)
    }
  )
}

/**
 * Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
 *
 * 18/08/2020 @robertcraigie added results parameter to pass data to an optional request preparer.
 * e.g. see providers/bungie
 */
function _get (provider, accessToken, results, callback) {
  let url = provider.profileUrl
  const headers = provider.headers || {}

  if (this._useAuthorizationHeaderForGET) {
    headers.Authorization = this.buildAuthHeader(accessToken)

    // This line is required for Twitch
    headers['Client-ID'] = provider.clientId
    accessToken = null
  }

  const prepareRequest = provider.prepareProfileRequest
  if (prepareRequest) {
    url = prepareRequest({ provider, url, headers, results }) || url
  }

  this._request('GET', url, headers, null, accessToken, callback)
}

function decodeIdToken (idToken) {
  if (!idToken) {
    throw new OAuthCallbackError('Missing JWT ID Token')
  }
  return jwtDecode(idToken, { json: true })
}
