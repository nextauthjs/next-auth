import { oAuthClient, oAuth2Client } from './index' // eslint-disable-line no-unused-vars

const oAuthCallback = async (req, provider, callback) => {
  if (provider.type === 'oauth') {
    _oAuthCallback(req, provider, callback)
  } else if (provider.type === 'oauth2') {
    _oAuth2Callback(req, provider, callback)
  }
}

const _oAuthCallback = async (req, provider, callback) => {
  const { oauth_token, oauth_verifier, code } = req.query // eslint-disable-line camelcase
  const client = oAuthClient(provider)

  if (provider.version && provider.version.startsWith('2.')) {
    // Handle oAuth v2.x
    const options = {
      redirect_uri: provider.callbackUrl
    }

    // Some oAuth providers, like Google, require options to be specified (e.g. grant_type)
    if (provider.options) {
      Object.entries(provider.options).forEach(([key, value]) => {
        options[key] = value
      })
    }

    // Pass authToken in header by default (unless 'useAuthTokenHeader: false' is set)
    if (Object.prototype.hasOwnProperty.call(provider, 'useAuthTokenHeader')) {
      client.useAuthorizationHeaderforGET(provider.useAuthTokenHeader)
    } else {
      client.useAuthorizationHeaderforGET(true)
    }

    client.getOAuthAccessToken(
      code,
      options,
      (error, accessToken, refreshToken, results) => {
        // @TODO Handle error
        if (error || results.error) {
          console.error('GET_OAUTH2_ACCESS_TOKEN_ERROR', error, results)
        }

        client.get(
          provider.profileUrl,
          accessToken,
          (error, profileData) => callback(error, _getProfile(error, profileData, accessToken, refreshToken, provider))
        )
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

const _oAuth2Callback = (req, provider, callback) => {
  console.error('The provider type oauth2 is not supported. Use "type: \'oauth\'" and specify "version: \'2.0\'" to use oAuth 2.x')
  /*
  const client = oAuth2Client(provider)
  client.code.getToken(req.url)
  .then(accessToken => {
    // Create 'Authorization' header with Bearer token
    var signedRequest = accessToken.sign({
      method: 'GET',
      url: provider.profileUrl,
    })

    fetch(provider.profileUrl, signedRequest)
    .then(response => response.json() )
    .then(profileData => callback(null, _getProfile(error, profileData, accessToken, null, provider), profileData) )
  })
  */
}

function _getProfile (error, profileData, accessToken, refreshToken, provider) {
  // @TODO Handle error
  if (error) {
    console.error('GET_OAUTH_PROFILE_ERROR', error)
  }

  let profile = {}
  try {
    // Convert profileData into an object if it's a string
    if (typeof profileData === 'string' || profileData instanceof String) { profileData = JSON.parse(profileData) }

    profile = provider.profile(profileData)
  } catch (exception) {
    // @TODO Handle parsing error
    if (exception) {
      console.error('PARSE_OAUTH_PROFILE_ERROR', exception)
    }
  }

  // Return profile, raw profile and auth provider details
  return ({
    profile: {
      name: profile.name,
      email: profile.email,
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

export {
  oAuthCallback
}
