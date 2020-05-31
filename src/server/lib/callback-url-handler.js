import cookie from '../lib/cookie'

export default async (req, res, options) => {
  const { query } = req
  const { body } = req
  const { cookies, site, defaultCallbackUrl } = options

  // The callbackUrlHandler function is used to validate callback URLs, so you
  // can easily allow (or deny) specific callback URLs.
  const callbackUrlHandler = options.callbackUrlHandler || callbackUrlHandlerDefaultFunction

  // Handle preserving and validating callback URLs
  // If no defaultCallbackUrl option specified, default to the homepage for the site
  let callbackUrl = defaultCallbackUrl || site
  
  // Try reading callbackUrlParamValue from request body (form submission) then from query param (get request)
  const callbackUrlParamValue = body.callbackUrl || query.callbackUrl || null
  const callbackUrlCookieValue = req.cookies[cookies.callbackUrl.name] || null
  if (callbackUrlParamValue) {
    // If callbackUrl form field or query parameter is passed try to use it if allowed
    callbackUrl = await callbackUrlHandler(callbackUrlParamValue, options)
  } else if (callbackUrlCookieValue) {
    // If no callbackUrl specified, try using the value from the cookie if allowed
    callbackUrl = await callbackUrlHandler(callbackUrlCookieValue, options)
  }

  // Save callback URL in a cookie so that can be used for subsequent requests in signin/signout/callback flow
  if (callbackUrl && (callbackUrl !== callbackUrlCookieValue)) { cookie.set(res, cookies.callbackUrl.name, callbackUrl, cookies.callbackUrl.options) }

  return Promise.resolve(callbackUrl)
}

// Default handler for callbackUrlHandler(url) checks the protocol and host
// matches the site name, if not then returns the canonical site url.
const callbackUrlHandlerDefaultFunction = (url, options) => {
  if (url.startsWith(options.site)) {
    return Promise.resolve(url)
  } else {
    return Promise.resolve(options.site)
  }
}
