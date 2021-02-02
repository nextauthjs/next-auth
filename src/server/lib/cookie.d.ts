export interface CookieOption {
  name: string
  options: {
    httpOnly: boolean
    sameSite: string
    path?: string
    secure: boolean
  }
}

export interface CookiesOptions {
  sessionToken: CookieOption
  callbackUrl: CookieOption
  csrfToken: CookieOption
  pkceCodeVerifier: CookieOption
}
