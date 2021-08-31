// @ts-check
import { NextAuthRequest, NextAuthResponse } from "../../lib/types"
import * as cookie from "../lib/cookie"

/**
 * Get callback URL based on query param / cookie + validation,
 * and add it to `req.options.callbackUrl`.
 */
export default async function callbackUrlHandler(
  req: NextAuthRequest,
  res: NextAuthResponse
) {
  const { query } = req
  const { body } = req
  const { cookies, baseUrl, callbacks } = req.options

  let callbackUrl = baseUrl
  // Try reading callbackUrlParamValue from request body (form submission) then from query param (get request)
  const callbackUrlParamValue = body.callbackUrl || query.callbackUrl || null
  const callbackUrlCookieValue = req.cookies[cookies.callbackUrl.name] || null
  if (callbackUrlParamValue) {
    // If callbackUrl form field or query parameter is passed try to use it if allowed
    callbackUrl = await callbacks.redirect({
      url: callbackUrlParamValue,
      baseUrl,
    })
  } else if (callbackUrlCookieValue) {
    // If no callbackUrl specified, try using the value from the cookie if allowed
    callbackUrl = await callbacks.redirect({
      url: callbackUrlCookieValue,
      baseUrl,
    })
  }

  // Save callback URL in a cookie so that it can be used for subsequent requests in signin/signout/callback flow
  if (callbackUrl && callbackUrl !== callbackUrlCookieValue) {
    cookie.set(
      res,
      cookies.callbackUrl.name,
      callbackUrl,
      cookies.callbackUrl.options
    )
  }

  req.options.callbackUrl = callbackUrl
}
