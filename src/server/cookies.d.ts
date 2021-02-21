export interface CookieOption {
  name?: string
  options?: {
    httpOnly?: boolean
    sameSite?: "lax" | "none" | "strict"
    path?: string
    secure?: boolean
  }
}


export type CookieType = "sessionToken" | "callbackUrl" | "csrfToken" | "accessToken" | "idToken"

export interface AccessToken {
  accessToken: string
  refreshToken?: string
  /** Saved as ISO string */
  accessTokenExpires?: Date
}

export type IdToken = string

export interface CookieOptions extends Record<CookieType, CookieOption> {

}