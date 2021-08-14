import { OAuthConfig } from "../providers"
import { Profile, LoggerInstance, Account } from "../index"
import { TokenSet } from "openid-client"

export interface GetProfileParams {
  profile: Profile
  tokens: TokenSet
  provider: OAuthConfig
  logger: LoggerInstance
}

export interface GetProfileResult {
  profile: ReturnType<OAuthConfig["profile"]> | null
  account: Omit<Account, "userId"> | null
  OAuthProfile: Profile
}

export type GetProfile = (params: GetProfileParams) => Promise<GetProfileResult>
