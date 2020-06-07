import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'

const encode = async ({ secret, key = secret, token = {}, maxAge }) => {
  // If maxAge is set remove any existing created/expiry dates and replace them
  if (maxAge) {
    if (token.iat) { delete token.iat }
    if (token.exp) { delete token.exp }
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

export default {
  encode,
  decode
}
