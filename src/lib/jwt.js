import jose from 'jose'
import hkdf from 'futoin-hkdf'
import logger from './logger'

// Set default algorithm to use for auto-generated signing key
const DEFAULT_SIGNATURE_ALGORITHM = 'HS512'

// Set default algorithm for auto-generated symmetric encryption key
const DEFAULT_ENCRYPTION_ALGORITHM = 'A256GCM'

// Use encryption or not by default
const DEFAULT_ENCRYPTION_ENABLED = false

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

const encode = async ({
  token = {},
  maxAge = DEFAULT_MAX_AGE,
  secret,
  signingKey,
  signingOptions = {
    expiresIn: `${maxAge}s`,
  },
  encryptionKey,
  encryptionOptions = {
    alg: 'dir',
    enc: DEFAULT_ENCRYPTION_ALGORITHM,
    zip: 'DEF'
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
    return jose.JWE.encrypt(signedToken, _encryptionKey, encryptionOptions)
  } else {
    return signedToken
  }
}

const decode = async ({
  secret,
  token,
  maxAge = DEFAULT_MAX_AGE,
  signingKey,
  verificationKey = signingKey, // Optional (defaults to encryptionKey)
  verificationOptions = {
    maxTokenAge: `${maxAge}s`,
    algorithms: [DEFAULT_SIGNATURE_ALGORITHM]
  },
  encryptionKey,
  decryptionKey = encryptionKey, // Optional (defaults to encryptionKey)
  decryptionOptions = {
    algorithms: [DEFAULT_ENCRYPTION_ALGORITHM]
  },
  encryption = DEFAULT_ENCRYPTION_ENABLED,
} = {}) => {
  if (!token) return null

  let tokenToVerify = token

  if (encryption) {
    // Encryption Key
    const _encryptionKey = (decryptionKey)
    ? jose.JWK.asKey(JSON.parse(decryptionKey))
    : getDerivedEncryptionKey(secret)

    // Decrypt token
    const decryptedToken = jose.JWE.decrypt(token, _encryptionKey, decryptionOptions)
    tokenToVerify = decryptedToken.toString('utf8')
  }

  // Signing Key
  const _signingKey = (verificationKey)
    ? jose.JWK.asKey(JSON.parse(verificationKey))
    : getDerivedSigningKey(secret)

  // Verify token
  return jose.JWT.verify(tokenToVerify, _signingKey, verificationOptions)
}

const getToken = async (args) => {
  const {
    req,
    // Use secure prefix for cookie name, unless URL is NEXTAUTH_URL is http://
    // or not set (e.g. development or test instance) case use unprefixed name
    secureCookie = !( !process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.startsWith('http://') ),
    cookieName = (secureCookie) ? '__Secure-next-auth.session-token' : 'next-auth.session-token'
  } = args
  if (!req) throw new Error('Must pass `req` to JWT getToken()')

  // Try to get token from cookie
  let token = req.cookies[cookieName]

  // If cookie not found in cookie look for bearer token in authorization header.
  // This allows clients that pass through tokens in headers rather than as
  // cookies to use this helper function.
  if (!token && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const urlEncodedToken = req.headers.authorization.split(' ')[1]
    token = decodeURIComponent(urlEncodedToken)
  }

  try {
    return await decode({ token, ...args })
  } catch (error) {
    return null
  }
}

// Generate warning (but only once at startup) when auto-generated keys are used
let DERIVED_SIGNING_KEY_WARNING = false
let DERIVED_ENCRYPTION_KEY_WARNING = false

const getDerivedSigningKey = (secret) => {
  if (!DERIVED_SIGNING_KEY_WARNING) {
    logger.warn('JWT_AUTO_GENERATED_SIGNING_KEY')
    DERIVED_SIGNING_KEY_WARNING = true
  }
  
  const buffer = hkdf(secret, 64, { info: 'NextAuth.js Generated Signing Key', hash: 'SHA-256' })
  const key = jose.JWK.asKey(buffer, { alg: DEFAULT_SIGNATURE_ALGORITHM, use: 'sig', kid: 'nextauth-auto-generated-signing-key' })
  return key
}

const getDerivedEncryptionKey = (secret) => {
  if (!DERIVED_ENCRYPTION_KEY_WARNING) {
    logger.warn('JWT_AUTO_GENERATED_ENCRYPTION_KEY')
    DERIVED_ENCRYPTION_KEY_WARNING = true
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
