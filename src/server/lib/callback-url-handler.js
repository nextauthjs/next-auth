import cookie from '../lib/cookie'

export default async (req, res, options) => {
  const { query } = req
  const { cookies, site, defaultCallbackUrl } = options
  const callbackUrlHandler = options.callbackUrlHandler || callbackUrlHandlerDefaultFunction

  // Handle preserving and validating callback URLs
  // If no defaultCallbackUrl option specified, default to the homepage for the site
  let callbackUrl = defaultCallbackUrl || site
  const callbackUrlParamValue = query.callbackUrl || null
  const callbackUrlCookieValue = req.cookies[cookies.callbackUrl.name] || null
  if (callbackUrlParamValue) {
    // If callbackUrl query parameter is passed, validate against callbackUrlHandler() function
    callbackUrl = await callbackUrlHandler(callbackUrlParamValue, options)
  } else if (callbackUrlCookieValue) {
    callbackUrl = await callbackUrlHandler(callbackUrlCookieValue, options)
  }

  // Save callback URL in a cookie so that can be used for subsequent requests in signin/signout/callback flow
  if (callbackUrl && (callbackUrl != callbackUrlCookieValue))
    cookie.set(res, cookies.callbackUrl.name, callbackUrl, cookies.callbackUrl.options)

  return Promise.resolve(callbackUrl)
}

// Default handler for callbackUrlHandler(url) checks the protcol and host
// matches the site name, if not then returns the canonical site url
const callbackUrlHandlerDefaultFunction = (url, options) => {
  if (url.startsWith(options.site)) {
    return Promise.resolve(url)
  } else {
    return  Promise.resolve(options.site)
  }
}