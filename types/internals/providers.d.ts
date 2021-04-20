import { CommonProviderOptions } from "../providers"

export interface AppProvider extends CommonProviderOptions {
  signinUrl: string
  callbackUrl: string
}
