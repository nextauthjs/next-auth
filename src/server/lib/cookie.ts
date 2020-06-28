// Function to set cookies server side
//
// Credit to @huv1k and @jshttp contributors for the code which this is based on (MIT License).
// * https://github.com/jshttp/cookie/blob/master/index.js
// * https://github.com/zeit/next.js/blob/master/examples/api-routes-middleware/utils/cookies.js
//
// As only partial functionlity is required, only the code we need has been incorporated here
// (with fixes for specific issues) to keep dependancy size down.
const set = (res, name, value, options = {}) => {
  const stringValue = typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value)

  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge)
    options.maxAge /= 1000
  }

  // Preserve any existing cookies that have already been set in the same session
  const setCookieHeader = res.getHeader('Set-Cookie') || []
  setCookieHeader.push(_serialize(name, String(stringValue), options))
  res.setHeader('Set-Cookie', setCookieHeader)
}

function _serialize (name, val, options) {
  const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/ // eslint-disable-line no-control-regex

  const opt = options || {}
  const enc = opt.encode || encodeURIComponent

  if (typeof enc !== 'function') { throw new TypeError('option encode is invalid') }

  if (!fieldContentRegExp.test(name)) { throw new TypeError('argument name is invalid') }

  const value = enc(val)

  if (value && !fieldContentRegExp.test(value)) { throw new TypeError('argument val is invalid') }

  let str = name + '=' + value

  if (opt.maxAge != null) {
    const maxAge = opt.maxAge - 0

    if (isNaN(maxAge) || !isFinite(maxAge)) { throw new TypeError('option maxAge is invalid') }

    str += '; Max-Age=' + Math.floor(maxAge)
  }

  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) { throw new TypeError('option domain is invalid') }

    str += '; Domain=' + opt.domain
  }

  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) { throw new TypeError('option path is invalid') }

    str += '; Path=' + opt.path
  } else {
    str += '; Path=/'
  }

  if (opt.expires) {
    let expires = opt.expires
    if (typeof opt.expires.toUTCString === 'function') {
      expires = opt.expires.toUTCString()
    } else {
      const dateExpires = new Date(opt.expires)
      expires = dateExpires.toUTCString()
    }
    str += '; Expires=' + expires
  }

  if (opt.httpOnly) { str += '; HttpOnly' }

  if (opt.secure) { str += '; Secure' }

  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === 'string' ? opt.sameSite.toLowerCase() : opt.sameSite

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict'
        break
      case 'lax':
        str += '; SameSite=Lax'
        break
      case 'strict':
        str += '; SameSite=Strict'
        break
      case 'none':
        str += '; SameSite=None'
        break
      default:
        throw new TypeError('option sameSite is invalid')
    }
  }

  return str
}

export default {
  set
}
