import { NextAuthResponse } from "src/lib/types";





export interface SignInServerPageParams extends BaseServerPageParams {
  csrfToken: string
  providers,
  callbackUrl,
  email,
  error: errorType
}