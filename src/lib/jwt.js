import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { parseCookies } from '../utils'

const getSessionToken = (cookies, cookieName) => {
  const secureCookieName = '__Secure-next-auth.session-token'
  const insecureCookieName = 'next-auth.session-token'
  return cookieName
    ? cookies[cookieName]
    : cookies[secureCookieName] || cookies[insecureCookieName]
}

const encode = async ({ secret, key = secret, token = {}, maxAge }) => {
  // If maxAge is set remove any existing created/expiry dates and replace them
  if (maxAge) {
    if (token.iat) {
      delete token.iat
    }
    if (token.exp) {
      delete token.exp
    }
  }
  const signedToken = jwt.sign(token, secret, { expiresIn: maxAge })
  const encryptedToken = CryptoJS.AES.encrypt(signedToken, key).toString()
  return encryptedToken
}

const decode = async ({ secret, key = secret, token, maxAge }) => {
  if (!token) return null
  const decryptedBytes = CryptoJS.AES.decrypt(token, key)
  const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8)
  const verifiedToken = jwt.verify(decryptedToken, secret, { maxAge })
  return verifiedToken
}

// This is a simple helper method to make it easier to use JWT Payload from an API route
const getJwtPayload = async ({ req, secret, cookieName }) => {
  if (!req || !secret) throw new Error('Must pass { req, secret } to getJWT()')
  const cookieValue = getSessionToken(req.cookies, cookieName)
  if (!cookieValue) {
    return null
  }

  try {
    return await decode({ secret, token: cookieValue })
  } catch (error) {
    return null
  }
}

// This helper returns signed JWT that could be used for passing to other API services
const getJwt = async ({ req, secret, cookieName }) => {
  if (!req || !secret) throw new Error('Must pass { req, secret } to getJWT()')
  const cookies = parseCookies(req.headers.cookie)
  const cookieValue = getSessionToken(cookies, cookieName)
  if (!cookieValue) {
    return null
  }
  const decryptedBytes = CryptoJS.AES.decrypt(cookieValue, secret)
  const token = decryptedBytes.toString(CryptoJS.enc.Utf8)
  return token
}

export default {
  encode,
  decode,
  getJwt,
  getJwtPayload
}
