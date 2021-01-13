import { Issuer } from 'openid-client'

/**
 * Creates an OAuth 2.0, OpenID Connect compatible client
 */
export default function getOAuthClient (provider) {
  const issuer = new Issuer({
    issuer: provider.id,
    authorization_endpoint: provider.authorizationUrl,
    userinfo_endpoint: provider.profileUrl,
    token_endpoint: provider.accessTokenUrl
  })

  const client = new issuer.Client({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    redirect_uris: [provider.callbackUrl],
    response_types: ['code']
  })

  return client
}

/// LEGACY OAuth 2.0 implementation downwards ///
// TODO: handle all edge cases below in the code above
// https://github.com/panva/node-openid-client/blob/master/docs/README.md
const querystring = require('querystring')
const logger = require('../../../lib/logger')
const { sign: jwtSign } = require('jsonwebtoken')

/**
 * @TODO Refactor monkey patching in OAuth2.getOAuthAccessToken() and OAuth2.get()
 * These methods have been forked from `node-oauth` to fix bugs; it may make
 * sense to migrate all the methods we need from node-oauth to nexth-auth (with
 * appropriate credit) to make it easier to maintain and address issues as they
 * come up, as the node-oauth package does not seem to be actively maintained.
 */

/**
 * Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
 */
export async function getOAuth2AccessToken (code, provider) {
  const url = provider.accessTokenUrl
  const params = { ...provider.params }
  const headers = { ...provider.headers }
  const codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code'

  if (!params[codeParam]) { params[codeParam] = code }

  if (!params.client_id) { params.client_id = provider.clientId }

  // For Apple the client secret must be generated on-the-fly.
  // Using the properties in clientSecret to create a JWT.
  if (provider.id === 'apple' && typeof provider.clientSecret === 'object') {
    const { keyId, teamId, privateKey } = provider.clientSecret
    const clientSecret = jwtSign({
      iss: teamId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (86400 * 180), // 6 months
      aud: 'https://appleid.apple.com',
      sub: provider.clientId
    },
    // Automatically convert \\n into \n if found in private key. If the key
    // is passed in an environment variable \n can get escaped as \\n
    privateKey.replace(/\\n/g, '\n'),
    { algorithm: 'ES256', keyid: keyId }
    )
    params.client_secret = clientSecret
  } else {
    params.client_secret = provider.clientSecret
  }

  if (!params.redirect_uri) { params.redirect_uri = provider.callbackUrl }

  if (!headers['Content-Type']) { headers['Content-Type'] = 'application/x-www-form-urlencoded' }
  // Added as a fix to accomodate change in Twitch OAuth API
  if (!headers['Client-ID']) { headers['Client-ID'] = provider.clientId }
  // Added as a fix for Reddit Authentication
  if (provider.id === 'reddit') {
    headers.Authorization = 'Basic ' + Buffer.from((provider.clientId + ':' + provider.clientSecret)).toString('base64')
  }

  if ((provider.id === 'okta' || provider.id === 'identity-server4') && !headers.Authorization) {
    headers.Authorization = `Bearer ${code}`
  }

  const postData = querystring.stringify(params)

  return new Promise((resolve, reject) => {
    this._request(
      'POST',
      url,
      headers,
      postData,
      null,
      (error, data, response) => {
        if (error) {
          logger.error('OAUTH_GET_ACCESS_TOKEN_ERROR', error, data, response)
          return reject(error)
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
        let accessToken = results.access_token
        if (provider.id === 'spotify') {
          accessToken = results.authed_user.access_token
        }
        const refreshToken = results.refresh_token
        resolve({ accessToken, refreshToken, results })
      }
    )
  })
}

/**
 * Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
 *
 * 18/08/2020 @robertcraigie added results parameter to pass data to an optional request preparer.
 * e.g. see providers/bungie
 */
export async function getOAuth2 (provider, accessToken, results) {
  let url = provider.profileUrl
  const headers = { ...provider.headers }

  if (this._useAuthorizationHeaderForGET) {
    headers.Authorization = this.buildAuthHeader(accessToken)

    // Mail.ru & vk.com require 'access_token' as URL request parameter
    if (['mailru', 'vk'].includes(provider.id)) {
      const safeAccessTokenURL = new URL(url)
      safeAccessTokenURL.searchParams.append('access_token', accessToken)
      url = safeAccessTokenURL.href
    }

    // This line is required for Twitch
    if (provider.id === 'twitch') {
      headers['Client-ID'] = provider.clientId
    }
    accessToken = null
  }

  if (provider.id === 'bungie') {
    url = prepareProfileUrl({ provider, url, results })
  }

  return new Promise((resolve, reject) => {
    this._request('GET', url, headers, null, accessToken, (error, profileData) => {
      if (error) {
        return reject(error)
      }
      resolve(profileData)
    })
  })
}

/** Bungie needs special handling */
function prepareProfileUrl ({ provider, url, results }) {
  if (!results.membership_id) {
    // internal error
    // @TODO: handle better
    throw new Error('Expected membership_id to be passed.')
  }

  if (!provider.headers?.['X-API-Key']) {
    throw new Error('The Bungie provider requires the X-API-Key option to be present in "headers".')
  }

  return url.replace('{membershipId}', results.membership_id)
}
