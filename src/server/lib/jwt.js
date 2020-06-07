import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'

const encode = async ({ secret, key = secret, token, maxAge }) => {
  const signedToken = await sign({ secret, token, maxAge })
  const encryptedToken = await encrypt({ key, token: signedToken })
  return encryptedToken
}

const decode = async ({ secret, key = secret, token, maxAge }) => {
  const decryptedToken = await decrypt({ key, token })
  const verifiedToken = await verify({ secret, token: decryptedToken, maxAge })
  return verifiedToken
}

const sign = async ({ secret, token, maxAge }) => {
  // If maxAge is specified, strip existing exp value from token if set, as only
  // one of them should be specified on a JWT
  if (maxAge && token.exp) { delete token.exp }

  const signedToken = jwt.sign(token, secret, { expiresIn: maxAge })
  return signedToken
}

const verify = async ({ secret, token, maxAge }) => {
  const verifiedToken = jwt.verify(token, secret, { maxAge })
  return Promise.resolve(verifiedToken)
}

const encrypt = async ({ key, token }) => {
  const encryptedToken = CryptoJS.AES.encrypt(token, key).toString()
  return encryptedToken
}

const decrypt = async ({ key, token }) => {
  const decryptedBytes = CryptoJS.AES.decrypt(token, key)
  const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8)
  return decryptedToken
}

export default {
  encode,
  decode,
  sign,
  verify,
  encrypt,
  decrypt
}
