import crypto from "crypto"
import * as jose from "jose"
import uuid from "uuid"
import { NextApiRequest } from "next"
import type { JWT, JWTDecodeParams, JWTEncodeParams } from "./types"

export * from "./types"

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

const now = () => Date.now() / 1000 | 0

export async function encode({
  token = {},
  maxAge = DEFAULT_MAX_AGE,
  secret,
}: JWTEncodeParams) {
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  return await new jose.EncryptJWT(token)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(crypto.randomUUID ? crypto.randomUUID() : uuid())
    .encrypt(encryptionSecret);
}

export async function decode({
  secret,
  token,
}: JWTDecodeParams): Promise<JWT | null> {
  if (!token) return null
  const encryptionSecret = await getDerivedEncryptionKey(secret);
  return (await jose.jwtDecrypt(token, encryptionSecret, { clockTolerance: 15 })).payload
}

export type GetTokenParams<R extends boolean = false> = {
  req: NextApiRequest
  secureCookie?: boolean
  cookieName?: string
  raw?: R
  decode?: typeof decode
  secret?: string
} & Omit<JWTDecodeParams, "secret">

/** [Documentation](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken) */
export async function getToken<R extends boolean = false>(
  params?: GetTokenParams<R>
): Promise<R extends true ? string : JWT | null> {
  const {
    req,
    // Use secure prefix for cookie name, unless URL is NEXTAUTH_URL is http://
    // or not set (e.g. development or test instance) case use unprefixed name
    secureCookie = !(
      !process.env.NEXTAUTH_URL ||
      process.env.NEXTAUTH_URL.startsWith("http://")
    ),
    cookieName = secureCookie
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    raw = false,
    decode: _decode = decode,
  } = params ?? {}
  if (!req) throw new Error("Must pass `req` to JWT getToken()")

  // Try to get token from cookie
  let token = req.cookies[cookieName]

  // If cookie not found in cookie look for bearer token in authorization header.
  // This allows clients that pass through tokens in headers rather than as
  // cookies to use this helper function.
  if (!token && req.headers.authorization?.split(" ")[0] === "Bearer") {
    const urlEncodedToken = req.headers.authorization.split(" ")[1]
    token = decodeURIComponent(urlEncodedToken)
  }

  if (raw) {
    // @ts-expect-error
    return token
  }

  try {
    // @ts-expect-error
    return await _decode({ token, ...params })
  } catch {
    // @ts-expect-error
    return null
  }
}

// Do the better hkdf of Node.js one added in `v15.0.0` and Third Party one
async function hkdf(secret, { byteLength, encryptionInfo, digest = "sha256" }) {
  if (crypto.hkdf) {
    return await new Promise((resolve, reject) => {
      crypto.hkdf(
        digest,
        secret,
        Buffer.alloc(0),
        encryptionInfo,
        byteLength,
        (err, derivedKey) => {
          if (err) {
            reject(err)
          } else {
            resolve(Buffer.from(derivedKey))
          }
        }
      )
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("futoin-hkdf")(secret, byteLength, {
    info: encryptionInfo,
    hash: digest,
  })
}

async function getDerivedEncryptionKey(secret) {
  return await hkdf(secret, {
    byteLength: 32,
    encryptionInfo: "NextAuth.js Generated Encryption Key",
  })
}
