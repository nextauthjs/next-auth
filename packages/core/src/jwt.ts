/**
 * ::: warning
 * This module is is not finished yet. The documentation/API is a work in progress and will change.
 * :::
 *
 * @module core/jwt
 */

import { hkdf } from "@panva/hkdf"
import { EncryptJWT, jwtDecrypt } from "jose"
import { SessionStore } from "./lib/cookie.js"
import { Awaitable } from "./lib/types.js"
import type { LoggerInstance } from "./lib/utils/logger.js"

const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60 // 30 days

const now = () => (Date.now() / 1000) | 0

/** Issues a JWT. By default, the JWT is encrypted using "A256GCM". */
export async function encode(params: JWTEncodeParams) {
  const { token = {}, secret, maxAge = DEFAULT_MAX_AGE } = params
  const encryptionSecret = await getDerivedEncryptionKey(secret)
  return await new EncryptJWT(token)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(now() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encryptionSecret)
}

/** Decodes a Auth.js issued JWT. */
export async function decode(params: JWTDecodeParams): Promise<JWT | null> {
  const { token, secret } = params
  if (!token) return null
  const encryptionSecret = await getDerivedEncryptionKey(secret)
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  })
  return payload
}

export interface GetTokenParams<R extends boolean = false> {
  /** The request containing the JWT either in the cookies or in the `Authorization` header. */
  req:
    | Request
    | { cookies: Record<string, string>; headers: Record<string, string> }
  /**
   * Use secure prefix for cookie name, unless URL in `NEXTAUTH_URL` is http://
   * or not set (e.g. development or test instance) case use unprefixed name
   */
  secureCookie?: boolean
  /** If the JWT is in the cookie, what name `getToken()` should look for. */
  cookieName?: string
  /**
   * `getToken()` will return the raw JWT if this is set to `true`
   *
   * @default false
   */
  raw?: R
  /**
   * The same `secret` used in the `NextAuth` configuration.
   * Defaults to the `AUTH_SECRET` environment variable.
   */
  secret?: string
  decode?: JWTOptions["decode"]
  logger?: LoggerInstance | Console
}

/**
 * Takes a Auth.js request (`req`) and returns either the Auth.js issued JWT's payload,
 * or the raw JWT string. We look for the JWT in the either the cookies, or the `Authorization` header.
 * [Documentation](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken)
 */
export async function getToken<R extends boolean = false>(
  params: GetTokenParams<R>
): Promise<R extends true ? string : JWT | null> {
  const {
    req,
    secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL,
    cookieName = secureCookie
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
    raw,
    decode: _decode = decode,
    logger = console,
    secret = process.env.AUTH_SECRET,
  } = params

  if (!req) throw new Error("Must pass `req` to JWT getToken()")

  const sessionStore = new SessionStore(
    { name: cookieName, options: { secure: secureCookie } },
    // @ts-expect-error
    { cookies: req.cookies, headers: req.headers },
    logger
  )

  let token = sessionStore.value

  const authorizationHeader =
    req.headers instanceof Headers
      ? req.headers.get("authorization")
      : req.headers.authorization

  if (!token && authorizationHeader?.split(" ")[0] === "Bearer") {
    const urlEncodedToken = authorizationHeader.split(" ")[1]
    token = decodeURIComponent(urlEncodedToken)
  }

  // @ts-expect-error
  if (!token) return null

  // @ts-expect-error
  if (raw) return token

  try {
    // @ts-expect-error
    return await _decode({ token, secret })
  } catch {
    // @ts-expect-error
    return null
  }
}

async function getDerivedEncryptionKey(secret: string) {
  return await hkdf(
    "sha256",
    secret,
    "",
    "Auth.js Generated Encryption Key",
    32
  )
}

export interface DefaultJWT extends Record<string, unknown> {
  name?: string | null
  email?: string | null
  picture?: string | null
  sub?: string
}

/**
 * Returned by the `jwt` callback and `getToken`, when using JWT sessions
 *
 * [`jwt` callback](https://next-auth.js.org/configuration/callbacks#jwt-callback) | [`getToken`](https://next-auth.js.org/tutorials/securing-pages-and-api-routes#using-gettoken)
 */
export interface JWT extends Record<string, unknown>, DefaultJWT {}

export interface JWTEncodeParams {
  /** The JWT payload. */
  token?: JWT
  /** The secret used to encode the Auth.js issued JWT. */
  secret: string
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 30 * 60 // 30 days
   */
  maxAge?: number
}

export interface JWTDecodeParams {
  /** The Auth.js issued JWT to be decoded */
  token?: string
  /** The secret used to decode the Auth.js issued JWT. */
  secret: string
}

export interface JWTOptions {
  /**
   * The secret used to encode/decode the Auth.js issued JWT.
   *
   * @deprecated  Set the `AUTH_SECRET` environment vairable or
   * use the top-level `secret` option instead
   */
  secret: string
  /**
   * The maximum age of the Auth.js issued JWT in seconds.
   *
   * @default 30 * 24 * 30 * 60 // 30 days
   */
  maxAge: number
  /** Override this method to control the Auth.js issued JWT encoding. */
  encode: (params: JWTEncodeParams) => Awaitable<string>
  /** Override this method to control the Auth.js issued JWT decoding. */
  decode: (params: JWTDecodeParams) => Awaitable<JWT | null>
}
