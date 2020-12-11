import jwt from "../lib/jwt"
import {CookieOptions} from "./cookies"

export interface JWTOptions {
  secret: string
  maxAge: number
  encode: typeof jwt.encode
  decode: typeof jwt.decode
}

export interface NextAuthOptions {
  jwt: JWTOptions
  secret: string
  provider: string
  cookies: CookieOptions
  session: {
    jwt?: boolean
    maxAge?: number
    updateAge?: number
  }
}