import * as cookie from '../lib/cookie'

/**
 * Get callback URL based on query param / cookie + validation,
 * and add it to `req.options.callbackUrl`.
 * @note: `req.options` must already be defined when called.
 */
export default async function callbackUrlHandler (req, res) {
  const { query } = req
  const { body } = req
  const { cookies, baseUrl, defaultCallbackUrl, callbacks } = req.options

  // Handle preserving and validating callback URLs
  // If no defaultCallbackUrl option specified, default to the homepage for the site
  let callbackUrl = defaultCallbackUrl || baseUrl
  // Try reading callbackUrlParamValue from request body (form submission) then from query param (get request)
  const callbackUrlParamValue = body.callbackUrl || query.callbackUrl || null
  const callbackUrlCookieValue = req.cookies[cookies.callbackUrl.name] || null
  if (callbackUrlParamValue) {
    // If callbackUrl form field or query parameter is passed try to use it if allowed
    callbackUrl = await callbacks.redirect(callbackUrlParamValue, baseUrl)
  } else if (callbackUrlCookieValue) {
    // If no callbackUrl specified, try using the value from the cookie if allowed
    callbackUrl = await callbacks.redirect(callbackUrlCookieValue, baseUrl)
  }

  // Save callback URL in a cookie so that can be used for subsequent requests in signin/signout/callback flow
  if (callbackUrl && (callbackUrl !== callbackUrlCookieValue)) {
    cookie.set(res, cookies.callbackUrl.name, callbackUrl, cookies.callbackUrl.options)
  }

  req.options.callbackUrl = callbackUrl
}
