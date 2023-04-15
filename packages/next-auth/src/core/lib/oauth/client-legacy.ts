// This is kept around for being backwards compatible with OAuth 1.0 providers.
// We have the intentions to provide only minor fixes for this in the future.

import { OAuth } from "oauth"
import type { InternalOptions } from "../../types"

/**
 * Client supporting OAuth 1.x
 */
export function oAuth1Client(options: InternalOptions<"oauth">) {
  const provider = options.provider

  const oauth1Client = new OAuth(
    provider.requestTokenUrl as string,
    provider.accessTokenUrl as string,
    provider.clientId as string,
    provider.clientSecret as string,
    provider.version ?? "1.0",
    provider.callbackUrl,
    provider.encoding ?? "HMAC-SHA1"
  )

  // Promisify get()  for OAuth1
  const originalGet = oauth1Client.get.bind(oauth1Client)
  // @ts-expect-error
  oauth1Client.get = async (...args) => {
    return await new Promise((resolve, reject) => {
      originalGet(...args, (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  }
  // Promisify getOAuth1AccessToken()  for OAuth1
  const originalGetOAuth1AccessToken =
    oauth1Client.getOAuthAccessToken.bind(oauth1Client)
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  oauth1Client.getOAuthAccessToken = async (...args: any[]) => {
    return await new Promise((resolve, reject) => {
      originalGetOAuth1AccessToken(
        ...args,
        (error: any, oauth_token: any, oauth_token_secret: any) => {
          if (error) {
            return reject(error)
          }
          resolve({ oauth_token, oauth_token_secret } as any)
        }
      )
    })
  }

  const originalGetOAuthRequestToken =
    oauth1Client.getOAuthRequestToken.bind(oauth1Client)
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  oauth1Client.getOAuthRequestToken = async (params = {}) => {
    return await new Promise((resolve, reject) => {
      originalGetOAuthRequestToken(
        params,
        (error, oauth_token, oauth_token_secret, params) => {
          if (error) {
            return reject(error)
          }
          resolve({ oauth_token, oauth_token_secret, params } as any)
        }
      )
    })
  }
  return oauth1Client
}

export const oAuth1TokenStore = new Map()
