import type { Awaitable } from ".."

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
  /**
   * Used in combination with `secret` when deriving the encryption secret for the various NextAuth.js-issued JWTs.
   * @note When no `salt` is passed, we assume this is a session token.
   * This is for backwards-compatibility with currently active sessions, so they won't be invalidated when upgrading the package.
   */
  salt?: string
  /** The key material used to encode the NextAuth.js issued JWTs. Defaults to `NEXTAUTH_SECRET`. */
  secret: string | Buffer
  /**
   * The maximum age of the NextAuth.js issued JWT in seconds.
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge?: number
}

export interface JWTDecodeParams {
  /** The NextAuth.js issued JWT to be decoded */
  token?: string
  /**
   * Used in combination with `secret` when deriving the encryption secret for the various NextAuth.js-issued JWTs.
   * @note When no `salt` is passed, we assume this is a session token.
   * This is for backwards-compatibility with currently active sessions, so they won't be invalidated when upgrading the package.
   */
  salt?: string
  /** The key material used to decode the NextAuth.js issued JWTs. Defaults to `NEXTAUTH_SECRET`. */
  secret: string | Buffer
}

export interface JWTOptions {
  /**
   * The secret used to encode/decode the NextAuth.js issued JWT.
   * @deprecated  Set the `NEXTAUTH_SECRET` environment variable or
   * use the top-level `secret` option instead
   */
  secret: string
  /**
   * The maximum age of the NextAuth.js issued JWT in seconds.
   * @default 30 * 24 * 60 * 60 // 30 days
   */
  maxAge: number
  /** Override this method to control the NextAuth.js issued JWT encoding. */
  encode: (params: JWTEncodeParams) => Awaitable<string>
  /** Override this method to control the NextAuth.js issued JWT decoding. */
  decode: (params: JWTDecodeParams) => Awaitable<JWT | null>
}

export type Secret = string | Buffer
