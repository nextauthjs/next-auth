import * as cookie from '../lib/cookie'
import baseUrl from '../../lib/baseUrl'

export default async function callbackUrlHandler (req, res) {
  const { query } = req
  const { body } = req
  const { cookies, defaultCallbackUrl, callbacks } = req.options
  const homepage = baseUrl().origin

  // Handle preserving and validating callback URLs
  // If no defaultCallbackUrl option specified, default to the homepage for the site
  let callbackUrl = defaultCallbackUrl || homepage
  // Try reading callbackUrlParamValue from request body (form submission) then from query param (get request)
  const callbackUrlParamValue = body.callbackUrl || query.callbackUrl || null
  const callbackUrlCookieValue = req.cookies[cookies.callbackUrl.name] || null
  if (callbackUrlParamValue) {
    // If callbackUrl form field or query parameter is passed try to use it if allowed
    callbackUrl = await callbacks.redirect(callbackUrlParamValue, homepage)
  } else if (callbackUrlCookieValue) {
    // If no callbackUrl specified, try using the value from the cookie if allowed
    callbackUrl = await callbacks.redirect(callbackUrlCookieValue, homepage)
  }

  // Save callback URL in a cookie so that can be used for subsequent requests in signin/signout/callback flow
  if (callbackUrl && (callbackUrl !== callbackUrlCookieValue)) { cookie.set(res, cookies.callbackUrl.name, callbackUrl, cookies.callbackUrl.options) }

  return Promise.resolve(callbackUrl)
}
