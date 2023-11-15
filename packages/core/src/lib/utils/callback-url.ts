import type { InternalOptions } from "../../types.js"

interface CreateCallbackUrlParams {
  options: InternalOptions
  /** Try reading value from request body (POST) then from query param (GET) */
  paramValue?: string
  cookieValue?: string
}

/**
 * Get callback URL based on query param / cookie + validation,
 * and add it to `req.options.callbackUrl`.
 */
export async function createCallbackUrl({
  options,
  paramValue,
  cookieValue,
}: CreateCallbackUrlParams) {
  const { url, callbacks } = options

  let callbackUrl = url.origin

  if (paramValue) {
    // If callbackUrl form field or query parameter is passed try to use it if allowed
    callbackUrl = await callbacks.redirect({
      url: paramValue,
      baseUrl: url.origin,
    })
  } else if (cookieValue) {
    // If no callbackUrl specified, try using the value from the cookie if allowed
    callbackUrl = await callbacks.redirect({
      url: cookieValue,
      baseUrl: url.origin,
    })
  }

  return {
    callbackUrl,
    // Save callback URL in a cookie so that it can be used for subsequent requests in signin/signout/callback flow
    callbackUrlCookie: callbackUrl !== cookieValue ? callbackUrl : undefined,
  }
}
