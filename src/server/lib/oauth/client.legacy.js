import { OAuth as OAuth1 } from 'oauth'
import logger from 'src/lib/logger'

/**
 * Creates an OAuth 1.x compatible client
 * @deprecated This method is implemented with 'oauth' and is being phased out.
 */
export default function getOAuthClientLegacy (provider) {
  if (!provider.version?.startsWith('1')) {
    throw new Error('You are using a legacy method to retrieve an OAuth 1 client for an OAuth 2 or OIDC client.')
  }
  const client = new OAuth1(
    provider.requestTokenUrl,
    provider.accessTokenUrl,
    provider.clientId,
    provider.clientSecret,
    provider.version || '1.0',
    provider.callbackUrl,
    provider.encoding || 'HMAC-SHA1'
  )

  // Promisify get() and getOAuth2AccessToken() for OAuth1
  const originalGet = client.get
  client.get = (...args) => {
    return new Promise((resolve, reject) => {
      originalGet(...args, (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  }
  const originalGetOAuth1AccessToken = client.getOAuthAccessToken
  client.getOAuthAccessToken = (...args) => {
    return new Promise((resolve, reject) => {
      originalGetOAuth1AccessToken(...args, (error, accessToken, refreshToken, results) => {
        if (error) {
          return reject(error)
        }
        resolve({ accessToken, refreshToken, results })
      })
    })
  }

  const originalGetOAuthRequestToken = client.getOAuthRequestToken
  client.getOAuthRequestToken = (...args) => {
    return new Promise((resolve, reject) => {
      originalGetOAuthRequestToken(...args, (error, oauthToken) => {
        if (error) {
          return reject(error)
        }
        resolve(oauthToken)
      })
    })
  }
  client.getProfile = getProfile

  return client
}

/**
 * //6/30/2020 @geraldnolan added userData parameter to attach additional data to the profileData object
 * Returns profile, raw profile and auth provider details
 */
async function getProfile ({ tokens: { accessToken, refreshToken }, provider }) {
  let profileData
  try {
    profileData = await this.get(provider.profileUrl, accessToken, refreshToken)

    // Convert profileData into an object if it's a string
    if (typeof profileData === 'string' || profileData instanceof String) {
      profileData = JSON.parse(profileData)
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
  } catch (error) {
    // If we didn't get a response either there was a problem with the provider
    // response *or* the user cancelled the action with the provider.
    //
    // Unfortuately, we can't tell which - at least not in a way that works for
    // all providers, so we return an empty object; the user should then be
    // redirected back to the sign up page. We log the error to help developers
    // who might be trying to debug this when configuring a new provider.
    logger.error('OAUTH_PARSE_PROFILE_ERROR', { error, profileData })
    return {
      profile: null,
      account: null,
      OAuthProfile: profileData
    }
  }
}
