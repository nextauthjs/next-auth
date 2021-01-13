export interface HandleOAuthCallbackResultObject {
  /**
   * Profile data returned by the `profile` provider option
   * @docs https://next-auth.js.org/configuration/providers#oauth-provider-options
   */
  profile?: Record<string, any>
  /** Contains tokens (access_token, refresh_token, id_token), and ... */
  account?: {
    accessToken: string
    accessTokenExpires: Date | string | null
    refreshToken?: string
    idToken?: string
    [key: string]: any
  }
  /** Raw profile returned from the OAuth provider */
  OAuthProfile?: {
    /** Returned by the Apple provider */
    user?: Record<string, any>
    [key: string]: any
  }
}