import oAuthClient from './client'
import querystring from 'querystring'
import jwt_decode from 'jwt-decode';

// @TODO Refactor monkey patching in _getOAuthAccessToken() and _get()
// These methods have been forked from `node-oauth` to fix bugs; it may make
// sense to migrate all the methods we need from node-oauth to nexth-auth (with
// appropriate credit) to make it easier to maintain and address issues as they
// come up, as the node-oauth package does not seem to be actively maintained.

export default async (req, provider, callback) => {
  let { oauth_token, oauth_verifier, code } = req.query // eslint-disable-line camelcase
  const client = oAuthClient(provider)

  if (provider.version && provider.version.startsWith('2.')) {

    if(req.method == 'POST')
    {
      //Get the CODE from Body
      const body = JSON.parse(JSON.stringify(req.body));
      code = body.code
    }

    // Pass authToken in header by default (unless 'useAuthTokenHeader: false' is set)
    if (Object.prototype.hasOwnProperty.call(provider, 'useAuthTokenHeader')) {
      client.useAuthorizationHeaderforGET(provider.useAuthTokenHeader)
    } else {
      client.useAuthorizationHeaderforGET(true)
    }

    // Use custom getOAuthAccessToken() method for oAuth2 flows
    client.getOAuthAccessToken = _getOAuthAccessToken

    client.getOAuthAccessToken(
      code,
      provider,
      (error, accessToken, refreshToken, results) => {
        // @TODO Handle error
        if (error || results.error) {
          console.error('GET_OAUTH2_ACCESS_TOKEN_ERROR', error, results, provider.id, code)
        }

        if(provider.type == "oauth-apple")
        {
          // Use custom get() method for oAuth2 flows
          client.get =  _decodeIDToken

          client.get(
            provider,
            accessToken,
            refreshToken, 
            results.id_token,
            (error, profileData) => callback(error, _getProfile(error, profileData, accessToken, refreshToken, provider))
          )
        }
        else
        {
          // Use custom get() method for oAuth2 flows
          client.get = _get

          client.get(
            provider,
            accessToken,
            (error, profileData) => callback(error, _getProfile(error, profileData, accessToken, refreshToken, provider))
          )
        }
      }
    )
  } else {
    // Handle oAuth v1.x
    client.getOAuthAccessToken(
      oauth_token,
      null,
      oauth_verifier,
      (error, accessToken, refreshToken, results) => {
        // @TODO Handle error
        if (error || results.error) {
          console.error('GET_OAUTH_ACCESS_TOKEN_ERROR', error, results)
        }

        client.get(
          provider.profileUrl,
          accessToken,
          refreshToken,
          (error, profileData) => callback(error, _getProfile(error, profileData, accessToken, refreshToken, provider))
        )
      }
    )
  }
}

async function _getProfile (error, profileData, accessToken, refreshToken, provider) {
  // @TODO Handle error
  if (error) {
    console.error('GET_OAUTH_PROFILE_ERROR', error)
  }

  let profile = {}
  try {
    // Convert profileData into an object if it's a string
    if (typeof profileData === 'string' || profileData instanceof String) { profileData = JSON.parse(profileData) }

    profile = await provider.profile(profileData)
  } catch (exception) {
    // @TODO Handle parsing error
    console.error('PARSE_OAUTH_PROFILE_ERROR', exception)
    throw new Error('Failed to get OAuth profile')
  }

  // Return profile, raw profile and auth provider details
  return ({
    profile: {
      name: profile.name,
      email: profile.email ? profile.email.toLowerCase() : null,
      image: profile.image
    },
    account: {
      provider: provider.id,
      type: provider.type,
      id: profile.id,
      refreshToken,
      accessToken,
      accessTokenExpires: null
    },
    _profile: profileData
  })
}

// Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
function _getOAuthAccessToken (code, provider, callback) {
  const url = provider.accessTokenUrl
  const params = { ...provider.params } || {}
  const headers = { ...provider.headers } || {}
  const codeParam = (params.grant_type === 'refresh_token') ? 'refresh_token' : 'code'

  if (!params[codeParam]) { params[codeParam] = code }

  if (!params.client_id) { params.client_id = provider.clientId }

  if (!params.client_secret) { params.client_secret = provider.clientSecret }

  if (!params.redirect_uri) { params.redirect_uri = provider.callbackUrl }

  if (!headers['Content-Type']) { headers['Content-Type'] = 'application/x-www-form-urlencoded' }

  // Added as a fix to accomodate change in Twitch oAuth API
  if (!headers['Client-ID']) { headers['Client-ID'] = provider.clientId }

  if (!headers.Authorization) { headers.Authorization = `Bearer ${code}` }

  const postData = querystring.stringify(params)

  this._request(
    'POST',
    url,
    headers,
    postData,
    null,
    (error, data, response) => {
      if (error) {
        console.error('_GET_OAUTH_ACCESS_TOKEN_ERROR', error, data, response)
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
      const accessToken = results.access_token
      const refreshToken = results.refresh_token
      callback(null, accessToken, refreshToken, results)
    }
  )
}

// Ported from https://github.com/ciaranj/node-oauth/blob/a7f8a1e21c362eb4ed2039431fb9ac2ae749f26a/lib/oauth2.js
function _get (provider, accessToken, callback) {
  const url = provider.profileUrl
  const headers = provider.headers || {}

  if (this._useAuthorizationHeaderForGET) {
    headers.Authorization = this.buildAuthHeader(accessToken)

    // This line is required for Twitch
    headers['Client-ID'] = provider.clientId
    accessToken = null
  }

  this._request('GET', url, headers, null, accessToken, callback)
}

/**
 * 05/26/2020 GN decodes jwt id_token converts back to json string that mimics a response from profile url
 * @param {*} provider  List of Providers
 * @param {*} accessToken 
 * @param {*} refreshToken 
 * @param {*} id_token jwt from Provider
 * @param {*} callback 
 */
function _decodeIDToken (provider, accessToken, refreshToken, id_token, callback) 
{
   if (!id_token) { throw new Error('Missing id_token') }

   const decoded = jwt_decode(id_token);
   const profileData = JSON.stringify(decoded)
   callback(null, profileData, accessToken, refreshToken, provider)
    
}
