import { OAuth } from "oauth"
import { Issuer } from "openid-client"

/**
 * Client supporting OAuth 1.x
 * @param {import("types/internals").AppOptions} options
 */
export async function oAuth1Client({ provider }) {
  const oauth1Client = new OAuth(
    provider.requestTokenUrl,
    provider.accessTokenUrl,
    provider.clientId,
    provider.clientSecret,
    provider.version || "1.0",
    provider.callbackUrl,
    provider.encoding || "HMAC-SHA1"
  )

  // Promisify get()  for OAuth1
  const originalGet = oauth1Client.get.bind(oauth1Client)
  oauth1Client.get = (...args) => {
    return new Promise((resolve, reject) => {
      originalGet(...args, (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  }
  // Promisify getOAuth1AccessToken()  for OAuth1
  const originalGetOAuth1AccessToken = oauth1Client.getOAuthAccessToken.bind(
    oauth1Client
  )
  oauth1Client.getOAuthAccessToken = (...args) => {
    return new Promise((resolve, reject) => {
      originalGetOAuth1AccessToken(
        ...args,
        // eslint-disable-next-line camelcase
        (error, oauth_token, oauth_token_secret, params) => {
          if (error) {
            return reject(error)
          }

          resolve({
            // TODO: Remove, this is only kept for backward compativility
            // These are not in the OAuth 1.x spec
            accessToken: oauth_token,
            refreshToken: oauth_token_secret,
            results: params,

            oauth_token,
            oauth_token_secret,
            params,
          })
        }
      )
    })
  }

  const originalGetOAuthRequestToken = oauth1Client.getOAuthRequestToken.bind(
    oauth1Client
  )
  oauth1Client.getOAuthRequestToken = (params = {}) => {
    return new Promise((resolve, reject) => {
      originalGetOAuthRequestToken(
        params,
        // eslint-disable-next-line camelcase
        (error, oauth_token, oauth_token_secret, params) => {
          if (error) {
            return reject(error)
          }
          resolve({ oauth_token, oauth_token_secret, params })
        }
      )
    })
  }
  return oauth1Client
}

/**
 * Client supporting Oauth 2.x and OIDC
 * @param {import("types/internals").AppOptions} options
 */
export async function openidClient({ provider, logger }) {
  let issuer

  // TODO: Check what other properties are unnecessary
  const oldConfigKeys = ["authorizationUrl", "accessTokenUrl", "profileUrl"]
  const providerKeys = Object.keys(provider)

  if (providerKeys.some((key) => oldConfigKeys.includes(key))) {
    // Support previous configs
    logger.warn(
      "OAUTH_CONFIG_DEPRECATED",
      "You are using an outdated configuration. Check the link for a migration guide."
    )
    issuer = new Issuer({
      issuer: `https://${provider.domain}`,
      authorization_endpoint: provider.authorizationUrl,
      userinfo_endpoint: provider.profileUrl,
      token_endpoint: provider.accessTokenUrl,
      jwks_uri: `https://${provider.domain}/.well-known/jwks.json`,
    })
  } else if (provider.issuerMetadata) {
    // The recommended way to pass the configuration
    issuer = new Issuer(provider.issuerMetadata)
  } else {
    if (!provider.issuer) {
      logger.error("NO_ISSUER")
      throw new Error("TODO")
    }
    // Fall back to fetching the metadata on each invocation, but warn
    const issuerUrl = `${provider.issuer}/.well-known/openid-configuration`
    logger.warn("ASYNC_ISSUER", issuerUrl)
    issuer = await Issuer.discover(issuerUrl)
  }

  return new issuer.Client({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    redirect_uris: [provider.callbackUrl],
  })
}
