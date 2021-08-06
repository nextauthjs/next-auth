import { Provider } from "../providers"
import { Profile, LoggerInstance } from "../index"
import { TokenSet } from "openid-client"

export interface GetProfileParams {
  profile: Profile
  tokens: TokenSet
  provider: Provider
  logger: LoggerInstance
}
