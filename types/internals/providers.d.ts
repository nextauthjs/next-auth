import { CommonProviderOptions } from "next-auth/providers"

export interface AppProvider extends CommonProviderOptions {
  signinUrl: string
  callbackUrl: string
}
