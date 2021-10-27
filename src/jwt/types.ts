import { decode, encode } from "."

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
  token?: JWT
  maxAge?: number
  secret: string | Buffer
}

export interface JWTDecodeParams {
  token?: string
  secret: string | Buffer
}

export interface JWTOptions {
  secret: string
  maxAge: number
  encode: typeof encode
  decode: typeof decode
}
