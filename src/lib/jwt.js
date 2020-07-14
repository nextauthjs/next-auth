// WIP
// @TODO Review DEFAULT_SIGNATURE_ALGORITHM selection
// @TODO Review DEFAULT_ENCRYPTION_ALGORITHM selection
// @TODO Support both symmetric and asymmetric keys for signing and encryption
//       We need create tutorials for JWE that also explain the use cases.
// @TODO Review adding zip encoding by default if using encryption
//
// Note: The implementation of the default algorithms is not compliant with all
// RFC recommendations and it is likely it is not possible to achive that, we
// want to combine the least possible friction with the best possible security 
// and keeping the solution flexible and be transparent about the limitations.

import jose from 'jose'
import hkdf from 'futoin-hkdf'
import logger from './logger'

// Set default algorithm to use for auto-generated signing key
const DEFAULT_SIGNATURE_ALGORITHM = 'HS512'

// Set default algorithm for auto-generated symmetric encryption key
const DEFAULT_ENCRYPTION_ALGORITHM = 'A256GCM'

// Use encryption or not by default
const DEFAULT_ENCRYPTION_ENABLED = false

// Generate warning (but only once at startup) when auto-generated keys are used
let SIGNING_KEY_WARNING = false
let ENCRYPTION_KEY_WARNING = false

const encode = async ({
  token = {},
  maxAge,
  secret,
  signingKey,
  signingOptions = {
    expiresIn: `${maxAge}s`,
  },
  encryptionKey,
  encryptionOptions = {
    alg: 'dir',
    enc: DEFAULT_ENCRYPTION_ALGORITHM
  },
  encryption = DEFAULT_ENCRYPTION_ENABLED,
} = {}) => {
  // Signing Key
  const _signingKey = (signingKey)
    ? jose.JWK.asKey(JSON.parse(signingKey))
    : getDerivedSigningKey(secret)
  
  // Sign token
  const signedToken = jose.JWT.sign(token, _signingKey, signingOptions)
  
  if (encryption) {
    // Encryption Key
    const _encryptionKey = (encryptionKey)
    ? jose.JWK.asKey(JSON.parse(encryptionKey))
    : getDerivedEncryptionKey(secret)

    // Encrypt token
    const tokenToEncrypt = signedToken
    return jose.JWE.encrypt(tokenToEncrypt, _encryptionKey, encryptionOptions)
  } else {
    return signedToken
  }
}

const decode = async ({
  secret,
  token,
  maxAge,
  signingKey,
  verificationOptions = {
    maxTokenAge: `${maxAge}s`,
    algorithms: [DEFAULT_SIGNATURE_ALGORITHM]
  },
  encryptionKey,
  decryptionOptions = {
    algorithms: [DEFAULT_ENCRYPTION_ALGORITHM]
  },
  encryption = DEFAULT_ENCRYPTION_ENABLED,
} = {}) => {
  if (!token) return null

  let tokenToVerify = token

  if (encryption) {
    // Encryption Key
    const _encryptionKey = (encryptionKey)
    ? jose.JWK.asKey(JSON.parse(encryptionKey))
    : getDerivedEncryptionKey(secret)

    // Decrypt token
    const decryptedToken = jose.JWE.decrypt(token, _encryptionKey, decryptionOptions)
    tokenToVerify = decryptedToken.toString('utf8')
  }

  // Signing Key
  const _signingKey = (signingKey)
    ? jose.JWK.asKey(JSON.parse(signingKey))
    : getDerivedSigningKey(secret)

  // Verify token
  return jose.JWT.verify(tokenToVerify, _signingKey, verificationOptions)
}

const getToken = async ({
  // Specific to getToken()
  req,
  secureCookie,
  cookieName,
  // Passed through to decode()
  secret,
  maxAge = 30 * 24 * 60 * 60,
  signingKey,
  verificationOptions,
  encryptionKey,
  decryptionOptions,
  encryption,
} = {}) => {
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
    return await decode({
      token,
      maxAge,
      encryption,
      secret,
      signingKey,
      verificationOptions,
      encryptionKey,
      decryptionOptions,
      encryption
    })
  } catch (error) {
    return null
  }
}

const getDerivedSigningKey = (secret) => {
  if (!SIGNING_KEY_WARNING) {
    logger.warn('JWT_ENCODE_AUTO_GENERATED_SIGNING_KEY')
    SIGNING_KEY_WARNING = true
  }
  
  const buffer = hkdf(secret, 32, { info: 'NextAuth.js Generated Signing Key', hash: 'SHA-256' })
  const key = jose.JWK.asKey(buffer, { alg: DEFAULT_SIGNATURE_ALGORITHM, use: 'sig', kid: 'nextauth-auto-generated-signing-key' })
  return key
}

const getDerivedEncryptionKey = (secret) => {
  if (!ENCRYPTION_KEY_WARNING) {
    logger.warn('JWT_ENCODE_AUTO_GENERATED_ENCRYPTION_KEY')
    ENCRYPTION_KEY_WARNING = true
  }
  
  const buffer = hkdf(secret, 32, { info: 'NextAuth.js Generated Encryption Key', hash: 'SHA-256' })
  const key = jose.JWK.asKey(buffer, { alg: DEFAULT_ENCRYPTION_ALGORITHM, use: 'enc', kid: 'nextauth-auto-generated-encryption-key' })
  return key
}

export default {
  encode,
  decode,
  getToken
}
