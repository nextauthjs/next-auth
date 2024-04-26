import { StringToBoolean } from "class-variance-authority/dist/types"
import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  /**
   * Represents an extension of the default Session interface in NextAuth.js
   * including the accessToken.
   */
  interface Session {
    accessToken?: string
    error?: "RefreshAccessTokenError"
  }
}

declare module "next-auth/jwt" {
  /**
   *
   */
  interface JWT {
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
    error?: "RefreshAccessTokenError"
  }
}
