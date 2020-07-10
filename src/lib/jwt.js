import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'

const SIGNING_ALGORITHM = 'HS256' // Specified explicitly to prevent tampering
const DEFAULT_ENCRYPTION_TYPE = 'AES' // Can be one of [ 'AES', false ]

const encode = async ({
  secret,
  key = secret,
  token = {},
  maxAge,
  encryption = DEFAULT_ENCRYPTION_TYPE
}) => {
  // If maxAge is set remove any existing created/expiry dates and replace them
  if (maxAge) {
    if (token.iat) { delete token.iat }
    if (token.exp) { delete token.exp }
  }

  const signedToken = jwt.sign(token, secret, { algorithm: SIGNING_ALGORITHM, expiresIn: maxAge })

  switch (encryption) {
    case false:
      return signedToken
    case 'AES':
      return CryptoJS.AES.encrypt(signedToken, key).toString()
    default:
      throw new Error('Unsupported value for `encryption` passed to JWT encode()', encryption)
  }
}

const decode = async ({
  secret,
  key = secret,
  token,
  maxAge,
  encryption = DEFAULT_ENCRYPTION_TYPE
}) => {
  if (!token) return null
  let tokenToVerify

  switch (encryption) {
    case false:
      tokenToVerify = token
      break
    case 'AES': {
      const decryptedBytes = CryptoJS.AES.decrypt(token, key)
      const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8)
      tokenToVerify = decryptedToken
      break
    }
    default:
      throw new Error('Unsupported value for `encryption` passed to JWT decode()', encryption)
  }

  return jwt.verify(tokenToVerify, secret, { algorithms: [SIGNING_ALGORITHM], maxAge })
}

const getToken = async ({
  req,
  secret,
  key = secret,
  maxAge,
  encryption,
  secureCookie,
  cookieName
}) => {
  if (!req) throw new Error('Must pass `req` to JWT getToken()')

  // If cookie is not specified, choose what cookie name to use in a secure way
  if (!cookieName) {
    if (typeof secureCookie === 'undefined') {
      // If secureCookie is not specified, assume unprefixed cookie in local dev
      // environments or if an explictly non HTTPS url is specified. Otherwise
      // asssume a secure prefixed cookie should be used.
      secureCookie = !((!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.startsWith('http://')))
    }
    // Use secure prefixed cookie by default. Only use unprefixed cookie name if
    // secureCookie is false or if the site URL is HTTP (and not HTTPS).
    cookieName = (secureCookie) ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
  }

  // Try to get token from cookie
  let token = req.cookies[cookieName]

  // If cookie not provided, look for bearer token in HTTP authorization header
  // This allows clients that pass through tokens in headers rather than as
  // cookies to use this helper function.
  if (!token && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const urlEncodedToken = req.headers.authorization.split(' ')[1]
    token = decodeURIComponent(urlEncodedToken)
  }

  try {
    return await decode({ secret, key, token, maxAge, encryption })
  } catch (error) {
    return null
  }
}

export default {
  encode,
  decode,
  getToken
}
